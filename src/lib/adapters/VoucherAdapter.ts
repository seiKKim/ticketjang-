/**
 * Voucher Verification Adapter Interface
 * Standardizes how we talk to different gift card APIs.
 */
export interface VoucherVerificationResult {
  isValid: boolean;
  faceValue: number; // Detected amount (e.g., 50000)
  message: string;
  transactionId?: string; // External API's transaction ID
}

export interface VoucherVerifier {
  verify(voucherType: string, pinCode: string): Promise<VoucherVerificationResult>;
}

/**
 * Mock Verifier Implementation
 * Simulates a real API call with delays and random results.
 */
export class MockVerifier implements VoucherVerifier {
  async verify(
    voucherType: string,
    pinCode: string
  ): Promise<VoucherVerificationResult> {
    console.log(`[MockAPI] Requesting verification for ${voucherType} : ${pinCode}`);
    
    // Simulate Network Latency (1.5s ~ 2.5s)
    const delay = 1500 + Math.random() * 1000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // A. Specific Fail Cases for Testing
    if (pinCode.endsWith("0000")) {
      return {
        isValid: false,
        faceValue: 0,
        message: "이미 사용된 핀번호입니다. (Code: 201)",
      };
    }
    if (pinCode.endsWith("9999")) {
      return {
        isValid: false,
        faceValue: 0,
        message: "유효하지 않은 핀번호 형식입니다. (Code: 404)",
      };
    }

    // B. Random Success/Failure (90% Success)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      return {
        isValid: true,
        faceValue: 50000, // Mocking fixed 50,000 KRW
        message: "정상",
        transactionId: `MOCK-${Date.now()}`
      };
    } else {
      return {
        isValid: false,
        faceValue: 0,
        message: "일시적인 통신 오류입니다. 잠시 후 재시도해주세요.",
      };
    }
  }
}
