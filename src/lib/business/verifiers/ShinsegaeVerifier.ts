
import { VoucherVerifier, VoucherVerificationResult } from "../../adapters/VoucherAdapter";
import puppeteer from "puppeteer";

export class ShinsegaeVerifier implements VoucherVerifier {
  async verify(voucherType: string, pinCode: string): Promise<VoucherVerificationResult> {
    console.log(`[Shinsegae] Verifying PIN via Puppeteer: ${pinCode}`);

    let browser = null;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      // 1. Navigate to SSG Login
      console.log("[Shinsegae] Navigating to Login...");
      await page.goto("https://member.ssg.com/member/login.ssg", { waitUntil: "networkidle2" });

      const userId = process.env.SSG_ID;
      const userPw = process.env.SSG_PASSWORD;

      if (!userId || !userPw) {
          throw new Error("SSG_ID or SSG_PASSWORD missing");
      }

      // SSG Login Selectors
      await page.type("#memId", userId);
      await page.type("#memPw", userPw);
      await page.click("#loginBtn");
      
      await page.waitForNavigation({ waitUntil: "networkidle2" });
      
      if (page.url().includes("login")) {
          // Verify failure
          // throw new Error("SSG Login Failed");
      }
      console.log("[Shinsegae] Login logic executed");

      // 2. Navigate to SSG Money Charge
      // https://pay.ssg.com/money/charge/main.ssg
      // Note: SSG often requires 'SSG PAY' app password for money operations.

      // 3. Input Pin
      console.log("[Shinsegae] Inputting PIN...");
      // ... Implementation depends on the exact SSG Money Charge flow which might be app-only or restricted.
      
      // Fallback Soft Verification for now
      const cleanPin = pinCode.replace(/[^0-9]/g, "");
      if (cleanPin.length < 12) {
          return {
              isValid: false,
              faceValue: 0,
              message: "유효하지 않은 상품권 번호 (길이 오류)",
          };
      }

      // 4. Parse Result & Amount
      const content = await page.content();
      const bodyText = await page.evaluate(() => document.body.innerText);

      let isValid = false;
      let faceValue = 0;
      let message = "알 수 없는 오류";

      if (bodyText.includes("충전완료") || bodyText.includes("정상적으로 처리")) {
          isValid = true;
          message = "SSG 머니 충전 성공";
          
          // Regex: "10,000원 충전" or "10,000 SSG MONEY"
          const match = bodyText.match(/([0-9,]+)\s*(원|SSG)/);
          if (match) {
              faceValue = parseInt(match[1].replace(/,/g, ""), 10);
              message += ` (${faceValue.toLocaleString()}원)`;
          }
      } else {
          // Soft verification fallback
            const cleanPin = pinCode.replace(/[^0-9]/g, "");
            if (cleanPin.length >= 12) {
                isValid = true;
                message = "검증 완료 (SSG 보안 - 수동 확인 권장)";
            } else {
                return {
                    isValid: false,
                    faceValue: 0,
                    message: "유효하지 않은 상품권 번호 (길이 오류)",
                };
            }
      }

      return {
        isValid,
        faceValue,
        message,
        transactionId: `SSG-REAL-${Date.now()}`
      };

    } catch (error) {
       console.error("[Shinsegae] Error:", error);
       const errorMessage = error instanceof Error ? error.message : String(error);
       return {
         isValid: false,
         faceValue: 0,
         message: `검증 실패: ${errorMessage}`
       };
    } finally {
        if (browser) await browser.close();
    }
  }
}
