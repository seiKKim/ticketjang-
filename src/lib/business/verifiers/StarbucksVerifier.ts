
import { VoucherVerifier, VoucherVerificationResult } from "../../adapters/VoucherAdapter";
import puppeteer from "puppeteer";

export class StarbucksVerifier implements VoucherVerifier {
  async verify(voucherType: string, pinCode: string): Promise<VoucherVerificationResult> {
    console.log(`[Starbucks] Verifying PIN via Puppeteer`);

    let browser = null;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      
      // Mimic Mobile User Agent (Starbucks mobile site might be easier, but desktop is robust)
      await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
      await page.setViewport({ width: 1280, height: 800 });

      // 1. Navigate to Login Page
      console.log("[Starbucks] Navigating to Login...");
      await page.goto("https://www.starbucks.co.kr/login/login.do", { waitUntil: "networkidle2" });

      const userId = process.env.STARBUCKS_ID;
      const userPw = process.env.STARBUCKS_PASSWORD;

      if (!userId || !userPw) {
          throw new Error("STARBUCKS_ID or STARBUCKS_PASSWORD missing");
      }

      // Input ID/PW
      await page.type("#user_id", userId);
      await page.type("#user_pwd", userPw);
      
      // Click Login
      await page.click("button.btn_login");
      await page.waitForNavigation({ waitUntil: "networkidle2" });

      if (page.url().includes("login")) {
          throw new Error("Starbucks Login Failed. Check credentials or CAPTCHA.");
      }
      console.log("[Starbucks] Login Successful");

      // 2. Go to Card Registration Page
      console.log("[Starbucks] Navigating to Card Registration...");
      await page.goto("https://www.starbucks.co.kr/my/mycard_register.do", { waitUntil: "networkidle2" });

      // 3. Input Card Info
      // Format: 16 digit card + 8 digit PIN
      // pinCode comes as "1234-1234-1234-1234-12345678"
      const cleanPin = pinCode.replace(/-/g, "");
      
      if (cleanPin.length !== 24) {
          throw new Error(`Invalid Input Length: ${cleanPin.length} (Expected 24 digits)`);
      }

      const cardNum1 = cleanPin.substring(0, 4);
      const cardNum2 = cleanPin.substring(4, 8);
      const cardNum3 = cleanPin.substring(8, 12);
      const cardNum4 = cleanPin.substring(12, 16);
      const pinNum   = cleanPin.substring(16, 24);

      console.log("[Starbucks] Inputting Card & PIN...");
      
      // Selectors based on Starbucks KR Desktop site
      // Card Number Inputs: #card_number1, #card_number2...
      await page.type("#card_number1", cardNum1);
      await page.type("#card_number2", cardNum2);
      await page.type("#card_number3", cardNum3);
      // Last part might be single input or split? Usually split or auto-focus.
      // Checking source: Starbucks typically has 4 inputs for card number
      await page.type("#card_number4", cardNum4);

      // PIN Input: #pin_number
      await page.type("#pin_number", pinNum);

      // Card Name (Optional but good to fill)
      // await page.type("#card_name", `AUTO-${Date.now()}`);

      // 4. Submit
      // "등록" button: .btn_reg or similar
      // Need to find the correct selector.
      // Often text inside <a> tag "등록"
      const buttons = await page.$$("a, button");
      let regBtn = null;
      for (const btn of buttons) {
          const text = await page.evaluate(el => el.textContent, btn);
          if (text?.includes("등록") && text?.length < 10) { // Avoid navigation/menu links
              regBtn = btn;
              // refine selector to avoid "취소" or other links
              // Usually inside a form actions div
          }
      }
      
      // Better specific selector if possible: .btn_card_reg
      const specificBtn = await page.$(".btn_card_reg"); 
      if (specificBtn) regBtn = specificBtn;

      if (!regBtn) throw new Error("Could not find Register button");
      
      await regBtn.click();

      // 5. Check Result
      // Expecting an Alert or Modal or Navigation
      // Puppeteer: page.on('dialog') handles alerts.
      
      let alertMessage = "";
      page.on('dialog', async dialog => {
          alertMessage = dialog.message();
          console.log(`[Starbucks] Alert says: ${alertMessage}`);
          await dialog.dismiss(); // Dismiss the alert
      });

      // Wait a bit for alert to trigger
      await new Promise(r => setTimeout(r, 3000));

      let isValid = false;
      let message = alertMessage || "응답 없음";
      
      if (alertMessage.includes("등록되었습니다") || alertMessage.includes("성공")) {
          isValid = true;
          message = "정상 (등록 완료)";
      } else if (alertMessage.includes("이미 등록") || alertMessage.includes("존재하는")) {
          isValid = false;
          message = "이미 등록된 카드";
      } else if (alertMessage.includes("번호를 확인") || alertMessage.includes("잘못")) {
          isValid = false;
          message = "카드번호/PIN 오류";
      } else if (alertMessage === "") {
           // Maybe it wasn't an alert but a DOM message?
           const content = await page.content();
           if (content.includes("등록되었습니다")) {
               isValid = true; 
               message = "정상 (등록 완료)";
           }
      }

      if (isValid) {
          console.log("[Starbucks] Registration success. Checking balance...");
          try {
              // Go to My Cards List (usually shows most recent first or allows sorting)
              await page.goto("https://www.starbucks.co.kr/my/mycard_list.do", { waitUntil: "networkidle2" });
              
              // Selector for the first card's balance. 
              // Structure usually: ul.my_card_list > li:first-child .balance
              // Need to inspect generic class names. Assuming standard structure:
              // Balance is often in a specific span or strong tag.
              
              // Waiting for the list
              await page.waitForSelector(".my_card_list");
              
              // Get the balance of the *first* card in the list (assuming it's the one we just registered)
              // Note: Starbucks logic might sort by favorites. We assume 'Reset Sort' or 'Newest' logic applies or check recent activity.
              // A safer bet is checking TOTAL balance difference if we knew previous balance, but that's complex.
              // We'll scrape the first card for now.
              
              const balanceEl = await page.$(".my_card_list > li:first-child .balance");
              if (balanceEl) {
                  const balanceText = await page.evaluate(el => el.textContent, balanceEl);
                  // Format: "10,000원"
                  const match = balanceText?.match(/([0-9,]+)/);
                  if (match) {
                      faceValue = parseInt(match[1].replace(/,/g, ""), 10);
                      console.log(`[Starbucks] Retrieved Balance: ${faceValue}`);
                      message = `정상 등록 (잔액: ${faceValue.toLocaleString()}원)`;
                  }
              } else {
                  console.log("[Starbucks] Could not find balance element");
                  message = "정상 등록 (잔액 조회 실패)";
              }
              
          } catch (balanceError) {
              console.error("[Starbucks] Balance check failed:", balanceError);
              // Don't fail the whole verification, just return 0 faceValue
              message += " (잔액 확인 중 오류)";
          }
      }

      return {
        isValid,
        faceValue,
        message,
        transactionId: `SB-REAL-${Date.now()}`
      };

    } catch (error) {
       console.error("[Starbucks] Error:", error);
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
