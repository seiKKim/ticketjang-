
import { VoucherVerifier, VoucherVerificationResult } from "../../adapters/VoucherAdapter";

export class HappyMoneyVerifier implements VoucherVerifier {
  async verify(voucherType: string, pinCode: string): Promise<VoucherVerificationResult> {
    console.log(`[HappyMoney] Verifying PIN: ${pinCode}`);

    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 500));

    // Happy Money: 16 digits + 8 digits (Issue Date) usually required, 
    // but often users just input PIN. Let's assume strict format for now.
    // Format: 1234-5678-1234-5678 (16 digits) or with date.
    // Let's assume simple 16 digits for this mock.
    const cleanPin = pinCode.replace(/-/g, "");
    
    if (cleanPin.length < 16) {
      return {
        isValid: false,
        faceValue: 0,
        message: "해피머니 핀번호 형식이 올바르지 않습니다.",
      };
    }

    if (cleanPin.endsWith("9999")) {
      return {
        isValid: false,
        faceValue: 0,
        message: "유효하지 않은 상품권입니다. (Code: H-404)",
      };
    }

    return {
      isValid: true,
      faceValue: 50000,
      message: "정상 (Happy Money)",
      transactionId: `HM-${Date.now()}`
    };
  }
}
