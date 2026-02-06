/**
 * PinValidator Service
 * Handles validation of voucher pin codes based on type.
 */
import { VerifierFactory } from "./VerifierFactory";

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
   * Validates the pin using the configured Adapter.
   */
  static async verifyPin(type: string, pin: string): Promise<{ isValid: boolean; message: string; faceValue?: number }> {
    // Use Factory to get the correct verifier implementation
    const verifier = VerifierFactory.getVerifier(type);
    
    const result = await verifier.verify(type, pin);
    
    return {
      isValid: result.isValid,
      message: result.message,
      faceValue: result.faceValue
    };
  }
}
