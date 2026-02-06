
import { VoucherVerifier, VoucherVerificationResult } from "../../adapters/VoucherAdapter";
import puppeteer from "puppeteer";

export class CultureLandVerifier implements VoucherVerifier {
  async verify(voucherType: string, pinCode: string): Promise<VoucherVerificationResult> {
    console.log(`[CultureLand] Verifying PIN via Puppeteer: ${pinCode}`);

    let browser = null;
    try {
      browser = await puppeteer.launch({
        headless: true, // Set to false for debugging
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      
      // Set User Agent to mimics a mobile device
      await page.setUserAgent("Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19");
      await page.setViewport({ width: 375, height: 812 });

      // 1. Login
      const userId = process.env.CULTURE_ID;
      const userPw = process.env.CULTURE_PASSWORD;

      if (!userId || !userPw) {
        throw new Error("Culture Land credentials not found in env");
      }

      console.log("[CultureLand] Navigating to Login Page...");
      await page.goto("https://m.cultureland.co.kr/mmb/loginMain.do", { waitUntil: "networkidle2" });

      // Type ID/PW
      // Note: Selectors might need adjustment if site changes
      await page.type("#txtUserId", userId);
      await page.type("#passwd", userPw);
      
      // Click Login
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2" }),
        page.click("#btnLogin"),
      ]);

      // Check if login failed (e.g., if we are still on login page or see error alert)
      if (page.url().includes("loginMain.do")) {
         throw new Error("Login failed. Check credentials or CAPTCHA.");
      }
      console.log("[CultureLand] Login Successful");

      // 2. Go to Voucher Usage Inquiry Page
      console.log("[CultureLand] Navigating to Inquiry Page...");
      await page.goto("https://m.cultureland.co.kr/vchr/voucherUsageGiftM.do", { waitUntil: "networkidle2" });

      // 3. Input PIN
      // Pin format: 1234-1234-1234-123456 (16 or 18 digits)
      const cleanPin = pinCode.replace(/-/g, "");
      const part1 = cleanPin.substring(0, 4);
      const part2 = cleanPin.substring(4, 8);
      const part3 = cleanPin.substring(8, 12);
      const part4 = cleanPin.substring(12); // Rest

      // Example selectors (these are hypothetical and need adjustment based on real DOM)
      // Usually inputs have names or IDs like pin1, pin2, etc.
      // Let's assume standard 4-input fields for now, or finding by index.
      
      // Wait for inputs to appear
      await page.waitForSelector("input[type=number]", { timeout: 5000 });
      const inputs = await page.$$("input[type=number]"); // Get all number inputs

      if (inputs.length >= 4) {
        await inputs[0].type(part1);
        await inputs[1].type(part2);
        await inputs[2].type(part3);
        await inputs[3].type(part4);
      } else {
        throw new Error("Input fields not found");
      }

      // 4. Click Check Button
      // Look for a button that says "조회" or similar
      const checkButton = await page.$("a#btnCheck"); // Common ID pattern, might need update
      if (checkButton) {
         await checkButton.click();
      } else {
         // Try finding by text if ID fails
         const buttons = await page.$$("a, button");
         for (const btn of buttons) {
           const text = await page.evaluate(el => el.textContent, btn);
           if (text?.includes("조회") || text?.includes("확인")) {
             await btn.click();
             break;
           }
         }
      }

      // 5. Wait for Result
      // Wait for modal or result area
      // This part is tricky without seeing the live DOM. 
      // We'll wait a bit and scrape the body text for keywords.
      await new Promise(r => setTimeout(r, 2000)); 

      const content = await page.content();
      
      let isValid = false;
      let message = "알 수 없는 오류";
      let faceValue = 0;

      if (content.includes("사용가능") || content.includes("충전가능")) {
        isValid = true;
        message = "사용 가능 (정상)";
        // Try to parse amount if visible
        // e.g., "10,000원"
        const match = content.match(/([0-9,]+)원/);
        if (match) {
            faceValue = parseInt(match[1].replace(/,/g, ""), 10);
        }
      } else if (content.includes("이미 사용") || content.includes("충전된")) {
        isValid = false;
        message = "이미 사용된 핀번호입니다.";
      } else if (content.includes("유효하지") || content.includes("오류")) {
        isValid = false;
        message = "유효하지 않은 핀번호입니다.";
      }

      return {
        isValid,
        faceValue,
        message,
        transactionId: `CL-REAL-${Date.now()}`
      };

    } catch (error) {
      console.error("[CultureLand] Puppeteer Error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        isValid: false,
        faceValue: 0,
        message: `검증 실패: ${errorMessage}`,
      };
    } finally {
      if (browser) await browser.close();
    }
  }
}
