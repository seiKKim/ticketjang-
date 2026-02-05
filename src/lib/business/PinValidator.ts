/**
 * PinValidator Service
 * Handles validation of voucher pin codes based on type.
 */
export class PinValidator {
  private static PATTERNS: Record<string, RegExp> = {
    CULTURE_LAND: /^\d{4}-\d{4}-\d{4}-\d{4,6}$/, // Example: 1234-1234-1234-123456
    HAPPY_MONEY: /^\d{4}-\d{4}-\d{4}-\d{4}$/,     // Example: 1234-1234-1234-1234
    BOOK_NLIFE: /^\d{4}-\d{4}-\d{4}-\d{4}$/,     // Example
    GOOGLE_GIFT: /^[A-Z0-9]{16,24}$/,            // Alphanumeric
  };

  /**
   * Validates the format of a pin code.
   */
  static validateFormat(type: string, pin: string): boolean {
    const pattern = this.PATTERNS[type];
    // If no specific pattern, assume generic number validation or pass true
    if (!pattern) return pin.length > 10; 
    return pattern.test(pin);
  }

  /**
   * Mocks an external API call to check if the pin is valid and unused.
   * In production, this would call the scraping server or voucher API.
   */
  static async verifyPin(type: string, pin: string): Promise<{ isValid: boolean; message: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock Failures for specific test pins
    if (pin.endsWith("0000")) {
      return { isValid: false, message: "이미 사용된 핀번호입니다." };
    }
    if (pin.endsWith("9999")) {
      return { isValid: false, message: "유효하지 않은 핀번호입니다." };
    }

    // 90% Success rate for other pins
    const isSuccess = Math.random() > 0.1;
    return isSuccess
      ? { isValid: true, message: "정상" }
      : { isValid: false, message: "일시적인 조회 오류입니다. 잠시 후 재시도해주세요." };
  }
}
