import { getPortOneToken, getBankCodeByName } from "@/lib/portone";

/**
 * PayoutSystem Service
 * Handles transfer related operations using PortOne API.
 */
export class PayoutSystem {
  /**
   * Processes a payout for a transaction.
   */
  static async processPayout(
    txId: string, 
    bankName: string, 
    accountNumber: string, 
    amount: number,
    holderName?: string
  ): Promise<{ success: boolean; txId: string; error?: string }> {
    console.log(`[Payout] Processing ${amount}KRW to ${bankName} ${accountNumber} for Tx ${txId}`);

    try {
      // 1. Get Bank Code
      const bankCode = getBankCodeByName(bankName);
      if (!bankCode) {
        throw new Error(`지원되지 않는 은행명입니다: ${bankName}`);
      }

      // 2. Get Access Token
      const token = await getPortOneToken();

      // 3. Call PortOne Transfer API
      // Note: Endpoint typically /transfer/banks or similar. 
      // Please verify specific endpoint in PortOne Admin > API Docs.
      // Using standard Iamport transfer endpoint structure.
      const response = await fetch("https://api.iamport.kr/transfer/banks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bank_code: bankCode,
          account_number: accountNumber,
          account_holder: holderName,
          amount: amount
        })
      });

      const data = await response.json();

      if (data.code !== 0) {
        throw new Error(data.message || "이체 요청 실패");
      }

      console.log(`[Payout] Success for Tx ${txId}, External Ref: ${data.response?.imp_uid}`);
      return { success: true, txId }; 

    } catch (e: unknown) {
      console.error("[Payout] Error", e);
      const errorMessage = e instanceof Error ? e.message : "Unknown Error";
      return { success: false, txId, error: errorMessage };
    }
  }
}
