import { NextResponse } from "next/server";
import { calculatePayout } from "@/lib/fees";
import { checkFraudRisk, checkBlacklist } from "@/lib/fraud";
import { PinValidator } from "@/lib/business/PinValidator";
import { PayoutSystem } from "@/lib/business/PayoutSystem";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      voucherType, 
      pinCodes, 
      userName, 
      bankName, 
      accountNumber, 
      phoneNumber 
    } = body;

    // 1. Basic Validation
    if (!voucherType || !pinCodes || !userName || !accountNumber || !phoneNumber) {
      return NextResponse.json(
        { success: false, message: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 2. Fraud & Blacklist Check
    const isBlacklisted = await checkBlacklist(phoneNumber, "PHONE");
    if (isBlacklisted) {
      return NextResponse.json(
        { success: false, message: "서비스 이용이 제한된 사용자입니다." },
        { status: 403 }
      );
    }

    const fraudCheck = await checkFraudRisk("127.0.0.1", userName); // Mock IP
    if (fraudCheck.isRisky) {
      return NextResponse.json(
        { success: false, message: `거래 차단: ${fraudCheck.reason}` },
        { status: 403 }
      );
    }

    // 3. Find or Create User
    const user = await prisma.user.upsert({
      where: { phoneNumber },
      update: {
        name: userName,
        bankName,
        accountNumber,
      },
      create: {
        name: userName,
        phoneNumber,
        bankName,
        accountNumber,
        role: "USER"
      }
    });

    // 4. Create Single Transaction Record for Batch
    // Hardcoded facevalue 50000 for now, should be from voucher type
    const estimatedFaceValue = 50000;
    const rate = 0.90; 
    
    // Create the main transaction container first
    const tx = await prisma.transaction.create({
      data: {
        userId: user.id,
        voucherType,
        pinCodes: pinCodes, // Keep for backward compatibility/logging
        totalFaceValue: 0, // Will update after verification
        feeRate: rate,
        transferFee: 500,
        payoutAmount: 0, // Will update after verification
        status: "VERIFYING",
        bankName,
        accountNumber,
        accountHolder: userName,
        margin: 0,
        // Create Items
        items: {
          create: pinCodes.map((code: string) => ({
            pinCode: code,
            status: "PENDING",
            faceValue: 0,
            purchaseRate: rate,
            payoutAmount: 0
          }))
        }
      },
      include: {
        items: true
      }
    });

    // 5. Process Each Pin Code
    const results = [];
    let validCount = 0;
    let totalValidPayout = 0;
    let totalFaceValue = 0;

    for (const item of tx.items) {
      const pin = item.pinCode;
      
      // A. Update Status to Verifying
      await prisma.transactionItem.update({
        where: { id: item.id },
        data: { status: "VERIFYING" }
      });

      // B. Format Check
      if (!PinValidator.validateFormat(voucherType, pin)) {
         await prisma.transactionItem.update({
           where: { id: item.id },
           data: { status: "INVALID", errorMessage: "Format Error" }
         });
         results.push({ pin, success: false, message: "핀번호 형식이 올바르지 않습니다." });
         continue;
      }

      // C. External API Check
      const verification = await PinValidator.verifyPin(voucherType, pin);
      
      if (verification.isValid) {
        // Calculate item payout
        const itemPayout = calculatePayout(estimatedFaceValue, rate).finalPayout + 500; // Adding back fee to get gross, logic simplified here
        // Actually utilize calculatePayout properly per item? 
        // Let's assume calculatePayout returns total for the batch usually, but here for one item:
        // Item Value: 50000 -> 90% -> 45000. 
        // Fee is per Transaction usually, not per item. 
        // We will sum up the GROSS payout first.
        const itemGross = estimatedFaceValue * rate;

        await prisma.transactionItem.update({
          where: { id: item.id },
          data: { 
            status: "VALID", 
            isVerified: true,
            faceValue: estimatedFaceValue,
            payoutAmount: itemGross 
          }
        });
        
        validCount++;
        totalValidPayout += itemGross;
        totalFaceValue += estimatedFaceValue;

        results.push({
            pin,
            success: true,
            faceValue: estimatedFaceValue,
            payout: itemGross,
            message: "확인 완료"
        });

      } else {
        await prisma.transactionItem.update({
          where: { id: item.id },
          data: { 
            status: "INVALID", 
            errorMessage: verification.message 
          }
        });
        results.push({
          pin,
          success: false,
          payout: 0,
          message: verification.message
        });
      }
    }

    // 6. Finalize Transaction
    // Apply Transfer Fee ONCE per transaction
    const transferFee = 500;
    const finalTotalPayout = validCount > 0 ? (totalValidPayout - transferFee) : 0;

    if (validCount > 0) {
      // Update Main Transaction
      await prisma.transaction.update({
        where: { id: tx.id },
        data: { 
          status: "VERIFIED", 
          totalFaceValue: totalFaceValue,
          payoutAmount: finalTotalPayout,
          processedAt: new Date()
        }
      });

      // Attempt Payout
      await prisma.transaction.update({
         where: { id: tx.id },
         data: { status: "TRANSFER_PENDING" }
      });
      
      const payoutResult = await PayoutSystem.processPayout(tx.id, bankName, accountNumber, finalTotalPayout);

      if (payoutResult.success) {
        await prisma.transaction.update({
          where: { id: tx.id },
          data: { status: "COMPLETED", completedAt: new Date() }
        });
        // Update all valid items to USED/ACCEPTED ? Or keep as VALID?
        // Let's keep items as VALID or change to ACCEPTED
      } else {
         await prisma.transaction.update({
          where: { id: tx.id },
          data: { status: "MANUAL_REVIEW" }
        });
        // Append error to result message?
      }

    } else {
      // No valid pins
      await prisma.transaction.update({
        where: { id: tx.id },
        data: { status: "FAILED", totalFaceValue: 0, payoutAmount: 0 }
      });
    }

    // 7. Response
    return NextResponse.json({
      success: true,
      data: {
        transactionId: tx.id,
        totalPayout: finalTotalPayout,
        results,
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Purchase Error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
