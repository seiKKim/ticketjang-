export interface FeeResult {
  faceValue: number;
  rate: number; // e.g., 0.90 for 90%
  purchaseAmount: number; // faceValue * rate
  transferFee: number; // e.g., 500
  finalPayout: number; // purchaseAmount - transferFee
}

/**
 * Calculates the final payout amount after applying the buy rate and subtracting the transfer fee.
 * @param faceValue The original value of the voucher (e.g., 50000)
 * @param rate The buy rate as a decimal (e.g., 0.90 for 90%)
 * @param transferFee The fee for bank transfer (default: 500 KRW)
 */
export function calculatePayout(
  faceValue: number,
  rate: number, 
  transferFee: number = 500
): FeeResult {
  // Calculate raw purchase amount (floor to avoid decimal)
  const purchaseAmount = Math.floor(faceValue * rate);
  
  // Subtract transfer fee, ensure not negative
  const finalPayout = Math.max(0, purchaseAmount - transferFee);

  return {
    faceValue,
    rate,
    purchaseAmount,
    transferFee,
    finalPayout,
  };
}
