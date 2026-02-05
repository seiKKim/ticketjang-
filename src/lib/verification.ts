interface VerificationResult {
  isValid: boolean;
  faceValue: number;
  message?: string;
}

/**
 * MOCK: Verifies the validity of a voucher PIN code.
 * In production, this would call the commodity voucher issuer's API.
 */
export async function verifyPin(
  voucherType: string,
  pinCode: string
): Promise<VerificationResult> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock Logic for testing
  // 1. PINs starting with '1' are valid 10,000 KRW
  // 2. PINs starting with '5' are valid 50,000 KRW
  // 3. Others are invalid
  if (pinCode.startsWith("1")) {
    return {
      isValid: true,
      faceValue: 10000,
      message: "정상 인증되었습니다.",
    };
  } else if (pinCode.startsWith("5")) {
    return {
      isValid: true,
      faceValue: 50000,
      message: "정상 인증되었습니다.",
    };
  } else {
    return {
      isValid: false,
      faceValue: 0,
      message: "유효하지 않은 핀번호이거나 이미 사용된 상품권입니다.",
    };
  }
}

/**
 * MOCK: Verifies if the account holder name matches the user's validated name.
 * Prevents 3rd party fraud.
 */
export async function checkIdentity(
  userName: string,
  bankName: string,
  accountNumber: string
): Promise<{ matched: boolean; reason?: string }> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  console.log(`[Identity Check] User: ${userName}, Account: ${bankName} ${accountNumber}`);

  // Mock Logic:
  // If name contains "사기", reject.
  if (userName.includes("사기")) {
    return { matched: false, reason: "예금주 명의와 실명이 일치하지 않습니다." };
  }

  return { matched: true };
}
