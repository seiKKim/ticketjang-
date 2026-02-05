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

    // 4. Process Each Pin Code
    const results = [];
    let totalPayout = 0;

    for (const pin of pinCodes) {
      // A. Create Initial Transaction Record
      // Hardcoded facevalue 50000 for now, ideally strictly validated per voucher type or input
      const faceValue = 50000; 
      const rate = 0.90; // Fetch from DB in real app
      const feeInfo = calculatePayout(faceValue, rate);
      const margin = 500; // Mock profit

      const tx = await prisma.transaction.create({
        data: {
          userId: user.id,
          voucherType,
          pinCodes: [pin], // Storing array for schema consistency
          totalFaceValue: faceValue,
          feeRate: rate,
          transferFee: feeInfo.transferFee,
          payoutAmount: feeInfo.finalPayout,
          status: "VERIFYING",
          bankName,
          accountNumber,
          accountHolder: userName,
          margin: margin
        }
      });

      // B. Validate Pin
      // Format Check first
      if (!PinValidator.validateFormat(voucherType, pin)) {
         await prisma.transaction.update({
           where: { id: tx.id },
           data: { status: "FAILED" }
         });
         results.push({ pin, success: false, message: "핀번호 형식이 올바르지 않습니다." });
         continue;
      }

      // External API Check
      const verification = await PinValidator.verifyPin(voucherType, pin);
      
      if (verification.isValid) {
        // C. Verified -> Payout
        await prisma.transaction.update({
          where: { id: tx.id },
          data: { status: "VERIFIED", processedAt: new Date() }
        });

        // Attempt Status Change to TRANSFER_PENDING
        await prisma.transaction.update({
           where: { id: tx.id },
           data: { status: "TRANSFER_PENDING" }
        });
        
        // D. Trigger Payout
        const payoutResult = await PayoutSystem.processPayout(tx.id, bankName, accountNumber, feeInfo.finalPayout);

        if (payoutResult.success) {
          await prisma.transaction.update({
            where: { id: tx.id },
            data: { status: "COMPLETED", completedAt: new Date() }
          });
          results.push({
            pin,
            success: true,
            faceValue,
            payout: feeInfo.finalPayout,
            message: "매입 및 이체 완료"
          });
          totalPayout += feeInfo.finalPayout;
        } else {
           await prisma.transaction.update({
            where: { id: tx.id },
            data: { status: "MANUAL_REVIEW" } // Failed transfer needs review
          });
          results.push({
            pin,
            success: false,
            message: `이체 실패: ${payoutResult.error} (관리자 문의)`
          });
        }

      } else {
        // Validation Failed
        await prisma.transaction.update({
          where: { id: tx.id },
          data: { status: "FAILED" }
        });
        results.push({
          pin,
          success: false,
          payout: 0,
          message: verification.message
        });
      }
    }

    // 5. Response
    return NextResponse.json({
      success: true,
      data: {
        totalPayout,
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
