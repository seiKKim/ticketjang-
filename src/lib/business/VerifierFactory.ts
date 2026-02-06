
import { VoucherVerifier } from "../adapters/VoucherAdapter";
import { CultureLandVerifier } from "./verifiers/CultureLandVerifier";
import { HappyMoneyVerifier } from "./verifiers/HappyMoneyVerifier";
import { TeencashVerifier } from "./verifiers/TeencashVerifier";
import { GoogleVerifier } from "./verifiers/GoogleVerifier";
import { StarbucksVerifier } from "./verifiers/StarbucksVerifier";
import { LotteVerifier } from "./verifiers/LotteVerifier";
import { ShinsegaeVerifier } from "./verifiers/ShinsegaeVerifier";
import { BooknLifeVerifier } from "./verifiers/BooknLifeVerifier";
import { MockVerifier } from "../adapters/VoucherAdapter"; // Fallback

export class VerifierFactory {
  static getVerifier(type: string): VoucherVerifier {
    const upperType = type.toUpperCase();

    if (upperType.includes("CULTURE") || upperType === "CULTURE_LAND") {
      return new CultureLandVerifier();
    }
    
    if (upperType.includes("HAPPY") || upperType === "HAPPY_MONEY") {
      return new HappyMoneyVerifier();
    }

    if (upperType.includes("TEEN") || upperType === "TEEN_CASH") {
      return new TeencashVerifier();
    }

    if (upperType.includes("GOOGLE")) {
      return new GoogleVerifier();
    }

    if (upperType.includes("STARBUCKS")) {
      return new StarbucksVerifier();
    }

    if (upperType.includes("LOTTE")) {
      return new LotteVerifier();
    }

    if (upperType.includes("SHINSEGAE")) {
      return new ShinsegaeVerifier();
    }

    if (upperType.includes("BOOK")) {
      return new BooknLifeVerifier();
    }

    // Default Fallback
    console.warn(`[Factory] No specific verifier for ${type}, using MockVerifier.`);
    return new MockVerifier();
  }
}
