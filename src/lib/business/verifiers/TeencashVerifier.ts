
import { VoucherVerifier, VoucherVerificationResult } from "../../adapters/VoucherAdapter";
import puppeteer from "puppeteer";

export class TeencashVerifier implements VoucherVerifier {
  async verify(voucherType: string, pinCode: string): Promise<VoucherVerificationResult> {
    console.log(`[Teencash] Verifying PIN via Puppeteer: ${pinCode}`);

    let browser = null;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      
      // Mimic Mobile/Desktop
      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
      await page.setViewport({ width: 1280, height: 800 });

      // 1. Logic: Go to Pin Reg Page immediately. It usually redirects to login if not authenticated
      const TARGET_URL = "https://www.teencash.co.kr/home/pin/reg";
      console.log(`[Teencash] Navigating to ${TARGET_URL}...`);
      await page.goto(TARGET_URL, { waitUntil: "networkidle2" });

      // Check if we are on login page (redirected)
      if (page.url().includes("login")) {
         console.log("[Teencash] Redirected to login. Attempting to login...");
         
         const userId = process.env.TEENCASH_ID;
         const userPw = process.env.TEENCASH_PASSWORD;

         if (!userId || !userPw) {
            throw new Error("Teencash credentials (TEENCASH_ID, TEENCASH_PASSWORD) not found in env");
         }

         // Generic selectors for login based on common practices (needs adjustment if specific IDs needed)
         // Attempting to find ID/PW inputs
         const idInput = await page.$("input[name='id'], input[name='user_id'], input[type='text']");
         const pwInput = await page.$("input[name='pw'], input[name='password'], input[type='password']");

         if (idInput && pwInput) {
            await idInput.type(userId);
            await pwInput.type(userPw);
            
            // Find login button
            const loginBtn = await page.$("button[type='submit'], input[type='image'], .btn_login");
            if (loginBtn) {
                await Promise.all([
                    page.waitForNavigation({ waitUntil: "networkidle2" }),
                    loginBtn.click(),
                ]);
            } else {
                 // Try 'Enter' key
                 await pwInput.press('Enter');
                 await page.waitForNavigation({ waitUntil: "networkidle2" });
            }
         } else {
             throw new Error("Could not find login input fields.");
         }
         
         console.log("[Teencash] Login submitted. Checking navigation...");
      }

      // 2. Ensure we are on the PIN Reg page
      if (!page.url().includes("/pin/reg")) {
          await page.goto(TARGET_URL, { waitUntil: "networkidle2" });
      }

      // 3. Input PIN
      // User said: 4 digits x 3 inputs
      const cleanPin = pinCode.replace(/-/g, "");
      const part1 = cleanPin.substring(0, 4);
      const part2 = cleanPin.substring(4, 8);
      const part3 = cleanPin.substring(8, 12);

      console.log("[Teencash] Inputting PIN segments...");
      
      // Wait for any input to ensure page loaded
      await page.waitForSelector("input", { timeout: 5000 });

      // Try broader selector: get ALL inputs
      const allInputs = await page.$$("input");
      console.log(`[Teencash] Found ${allInputs.length} total inputs. Filtering...`);

      const validInputs = [];
      for (const input of allInputs) {
          const type = await page.evaluate(el => el.getAttribute("type"), input);
          const name = await page.evaluate(el => el.getAttribute("name"), input);
          const isHidden = await page.evaluate(el => {
              const style = window.getComputedStyle(el);
              return style.display === 'none' || style.visibility === 'hidden' || el.getAttribute("type") === "hidden";
          }, input);

          if (!isHidden && (type === 'text' || type === 'password' || type === 'number' || type === 'tel')) {
               console.log(`[Teencash] Found potential input: name=${name}, type=${type}`);
               validInputs.push(input);
          }
      }

      // Assuming the first 3 visible text/number inputs are for the PIN
      if (validInputs.length >= 3) {
          await validInputs[validInputs.length - 3].type(part1); // Heuristic: valid inputs often include search/login, but typically PIN inputs are clustered. 
          // Actually, relying on index is risky. Let's try to find consecutive inputs or use the first 3 if they look like PIN fields.
          // Reverting to "First 3 valid inputs" for now as it's the safest bet for a PIN page without other forms.
          // BUT, if there is a search bar, it might be first. 
          // Let's stick to the user's "3 inputs" description.
          
          await validInputs[0].type(part1);
          await validInputs[1].type(part2);
          await validInputs[2].type(part3);
      } else {
          // Dump HTML for debugging if failed
          const html = await page.content();
          console.log("[Teencash] Page HTML snapshot (truncated):", html.substring(0, 500));
          throw new Error(`Could not find 3 input fields for PIN. Found ${validInputs.length} candidates.`);
      }

      // 4. Click Register/Check Button
      // Look for button with text "충전" or "등록"
      // Or simple submit
      const buttons = await page.$$("a, button, input[type='button'], input[type='image']");
      let clicked = false;
      for (const btn of buttons) {
          const text = await page.evaluate(el => el.textContent || (el as HTMLInputElement).value, btn);
          if (text && (text.includes("충전") || text.includes("등록") || text.includes("확인"))) {
              await btn.click();
              clicked = true;
              break;
          }
      }

      if (!clicked) {
          throw new Error("Could not find 'Charge/Register' button.");
      }

      // 5. Check Result
      await new Promise(r => setTimeout(r, 2000)); // Wait for alert or page update

      // Handle Switch/Alerts if any
      // Puppeteer handles alerts by default by dismissing, but we might miss the message.
      // Typically we check page content.
      
      const content = await page.content();
      let isValid = false;
      let message = "알 수 없는 오류";
      let faceValue = 0;

      if (content.includes("충전이 완료") || content.includes("성공")) {
          isValid = true;
          message = "정상 (충전 완료)";
          // Try parse amount
           const match = content.match(/([0-9,]+)원/);
            if (match) {
                faceValue = parseInt(match[1].replace(/,/g, ""), 10);
            }
      } else if (content.includes("이미 사용") || content.includes("중복")) {
          isValid = false;
          message = "이미 사용된 핀번호";
      } else if (content.includes("오류") || content.includes("틀렸")) {
          isValid = false;
          message = "PIN 번호 오류";
      }

      return {
        isValid,
        faceValue,
        message,
        transactionId: `TC-REAL-${Date.now()}`
      };

    } catch (error) {
       console.error("[Teencash] Error:", error);
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
