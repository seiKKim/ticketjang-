
import { VoucherVerifier, VoucherVerificationResult } from "../../adapters/VoucherAdapter";
import puppeteer from "puppeteer";

export class GoogleVerifier implements VoucherVerifier {
  async verify(voucherType: string, pinCode: string): Promise<VoucherVerificationResult> {
    console.log(`[Google] Verifying PIN via Puppeteer: ${pinCode}`);

    let browser = null;
    try {
      browser = await puppeteer.launch({
        headless: true, 
        args: [
            "--no-sandbox", 
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled" // Try to mask automation
        ],
      });

      const page = await browser.newPage();
      
      // Mimic generic Chrome on Windows
      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
      await page.setViewport({ width: 1280, height: 800 });

      // 1. Login
      const email = process.env.GOOGLE_EMAIL;
      const password = process.env.GOOGLE_PASSWORD;

      if (!email || !password) {
          throw new Error("GOOGLE_EMAIL or GOOGLE_PASSWORD env var missing");
      }

      console.log("[Google] Navigating to Login...");
      await page.goto("https://accounts.google.com/signin/v2/identifier", { waitUntil: "networkidle2" });

      // Email
      await page.waitForSelector('input[type="email"]');
      await page.type('input[type="email"]', email, { delay: 100 });
      await page.keyboard.press("Enter");
      
      // Wait for Password (animation)
      await new Promise(r => setTimeout(r, 2000));
      
      // Check if email was rejected or immediate error
      if (page.url().includes("identifier")) {
          // Sometimes it fails here
      }

      await page.waitForSelector('input[type="password"]', { visible: true, timeout: 10000 });
      await page.type('input[type="password"]', password, { delay: 120 });
      await page.keyboard.press("Enter");

      // Wait for login to complete
      await page.waitForNavigation({ waitUntil: "networkidle2" });
      
      // Check for 2FA or failure
      if (page.url().includes("signin") || page.url().includes("challenge")) {
          throw new Error("Login interrupted (2FA, CAPTCHA, or Wrong Password). Cannot proceed automatically.");
      }

      // 2. Go to Redeem Page
      console.log("[Google] Login successful. Navigating to Redeem page...");
      await page.goto("https://play.google.com/redeem", { waitUntil: "networkidle2" });

      // 3. Input Code
      // Note: play.google.com/redeem might be an overlay or redirect
      // We look for the main input.
      await page.waitForSelector("input", { timeout: 10000 });
      
      // Find the specific redeem input. Usually has placeholder "Enter code"
      const inputs = await page.$$("input");
      let typeInput = null;

      for (const input of inputs) {
          const placeholder = await page.evaluate(el => el.getAttribute("placeholder"), input);
          if (placeholder && (placeholder.includes("code") || placeholder.includes("코드"))) {
              typeInput = input;
              break;
          }
      }

      if (!typeInput && inputs.length > 0) {
          // Fallback: use first visible text input
           typeInput = inputs[0]; 
      }

      if (!typeInput) throw new Error("Could not find Redeem Code input.");

      console.log("[Google] Inputting code...");
      const cleanPin = pinCode.replace(/-/g, ""); // Strip hyphens just in case
      await typeInput.type(cleanPin, { delay: 50 });
      await page.keyboard.press("Enter");

      // 4. Check Result
      // Wait for result modal
      await new Promise(r => setTimeout(r, 3000));

      const content = await page.content();
      const bodyText = await page.evaluate(() => document.body.innerText);

      let isValid = false;
      let message = "알 수 없는 오류";
      let faceValue = 0;

      // Positive signals: "Confirm", "You are about to add", "계정에 추가", "충전하시겠습니까"
      // Negative signals: "Redeemed", "already used", "이미 사용", "wrong", "잘못된"

      if (bodyText.includes("Confirm") || bodyText.includes("충전") || bodyText.includes("add") || bodyText.includes("추가")) {
          isValid = true;
          message = "정상 (충전 가능)";
          // Attempt to extract amount if possible, e.g. "₩10,000"
          const match = bodyText.match(/([0-9,]+)\s*원/); // naive regex
          if (match) {
             faceValue = parseInt(match[1].replace(/,/g, ""), 10);
          }
          
          // IMPORTANT: DO NOT CLICK CONFIRM. JUST EXIT.
          console.log("[Google] Validation Confirmation appeared. Code is GOOD.");

      } else if (bodyText.includes("already") || bodyText.includes("이미 사용") || bodyText.includes("사용된")) {
          isValid = false;
          message = "이미 사용된 코드";
      } else if (bodyText.includes("wrong") || bodyText.includes("correct") || bodyText.includes("잘못") || bodyText.includes("유효하지")) {
          isValid = false;
          message = "코드 오류";
      } else if (bodyText.includes("need more info") || bodyText.includes("정보가 더 필요")) {
          isValid = false;
          message = "구글 계정/코드 상세 확인 필요";
      } else {
          // Log for debugging
          console.log("[Google] Unknown State Text:", bodyText.substring(0, 200));
          
          // If we are still on the same page with no modal, maybe it failed silently or input was ignored.
          message = "검증 결과 확인 불가 (응답 없음)";
      }

      return {
        isValid,
        faceValue,
        message,
        transactionId: `GOOG-REAL-${Date.now()}`
      };

    } catch (error) {
       console.error("[Google] Error:", error);
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
