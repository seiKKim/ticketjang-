
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const phone = searchParams.get("phone");

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: "이름과 휴대폰 번호가 필요합니다." },
        { status: 400 }
      );
    }

    // Calculate date 1 year ago
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const transactions = await prisma.transaction.findMany({
      where: {
        AND: [
          {
            OR: [
              { accountHolder: name }, // Check Account Holder Name
              { user: { name: name } }, // Check Registered User Name
            ],
          },
          {
            OR: [
              // We check against user phone number if registered
              // Ideally the transaction itself should snapshot phone number for guests, 
              // but currently schema might rely on user relationship or context.
              // Based on schema, User has phoneNumber. 
              // If it's a guest transaction, we might need to check how it was stored.
              // Looking at schema: User model has phoneNumber. Transaction links to User.
              // So we check user.phoneNumber
              { user: { phoneNumber: phone } },
              // Also check if blacklist/other fields might store it? No.
              // If guest checkout creates a temporary user or reuse logic, this works.
              // If phone number format differs (010-1234-5678 vs 01012345678), we might need loose matching.
              // For now, exact match is safer.
            ],
          },
          {
            createdAt: {
              gte: oneYearAgo,
            },
          },
        ],
      },
      select: {
        id: true,
        voucherType: true,
        totalFaceValue: true,
        payoutAmount: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Order lookup error:", error);
    return NextResponse.json(
      { success: false, message: "주문 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
