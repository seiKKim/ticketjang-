
import { NextResponse } from "next/server";
import { PinValidator } from "@/lib/business/PinValidator";

export async function POST(request: Request) {
  try {
    const { voucherType, pinCode } = await request.json();

    if (!voucherType || !pinCode) {
      return NextResponse.json(
        { success: false, message: "상품권 정보가 부족합니다." },
        { status: 400 }
      );
    }

    // 1. Format Check
    if (!PinValidator.validateFormat(voucherType, pinCode)) {
      return NextResponse.json({
         isValid: false,
         message: "핀번호 형식이 올바르지 않습니다.",
         faceValue: 0
      });
    }

    // 2. Verify
    // For Culture Land, this triggers Puppeteer
    const result = await PinValidator.verifyPin(voucherType, pinCode);

    return NextResponse.json({
      isValid: result.isValid,
      message: result.message,
      faceValue: result.faceValue
    });

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
