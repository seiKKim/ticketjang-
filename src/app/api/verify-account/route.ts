import { NextResponse } from "next/server";

// Standard Bank Codes (Open Banking / KFTC standards)
const BANK_CODE_MAP: Record<string, string> = {
  // Major Banks
  kakao: "090", // Kakao Bank
  kb: "004", // KB Kookmin
  shinhan: "088", // Shinhan
  woori: "020", // Woori
  hana: "081", // Hana
  nh: "011", // NH Nonghyup
  ibk: "003", // IBK Industrial
  toss: "092", // Toss Bank
  kbank: "089", // K-Bank
  sc: "023", // SC First
  citi: "027", // Citi
  kdb: "002", // KDB Industrial

  // Local Banks
  daegu: "031", // DGB Daegu
  busan: "032", // Busan
  kyongnam: "039", // Kyongnam
  gwangju: "034", // Gwangju
  jeonbuk: "037", // Jeonbuk
  jeju: "035", // Jeju

  // Others
  post: "071", // Win Post
  kfcc: "045", // KFCC
  cu: "048", // Shinhyup
  suhyup: "007", // Suhyup
  sb: "050", // Savings Bank
  sj: "064", // Forestry

  // Securities
  kiwoom: "264", // Kiwoom
  mirae: "238", // Mirae Asset
  samsung: "240", // Samsung
  koreainv: "243", // Korea Investment
  nhinv: "247", // NH Investment
  kbinv: "218", // KB Securities
  kakaopay: "287", // Kakao Pay Securities (Check if supported, often 287)
  tosssec: "271", // Toss Securities (Check code)
  shinhaninv: "278", // Shinhan Investment
  hanainv: "270", // Hana Securities
  hyundai: "263", // Hyundai Motor
  daishin: "267", // Daishin
  meritz: "287", // Meritz (Code varies, verifying...) -> 261 usually? Let's use generic list if unsure, but for now strict common codes.
  yuanta: "209", // Yuanta
  eugene: "280", // Eugene
  hanwha: "269", // Hanwha
  db: "279", // DB
  kyobo: "261", // Kyobo
  bookook: "290", // Bookook
  shinyoung: "291", // Shinyoung
  sk: "266", // SK
  cape: "292", // Cape
  // Add others as needed or handle fallback
};

export async function POST(request: Request) {
  try {
    const { bankCode, accountNumber } = await request.json();

    const standardBankCode = BANK_CODE_MAP[bankCode];
    if (!standardBankCode) {
      return NextResponse.json(
        { success: false, message: "지원되지 않는 금융기관 코드입니다." },
        { status: 400 }
      );
    }

    const apiKey = process.env.PORTONE_API_KEY;
    const apiSecret = process.env.PORTONE_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error("PortOne API Keys missing");
      return NextResponse.json(
        { success: false, message: "서버 설정 오류 (API Key Missing)" },
        { status: 500 }
      );
    }

    // 1. Get Access Token
    const tokenRes = await fetch("https://api.iamport.kr/users/getToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imp_key: apiKey,
        imp_secret: apiSecret,
      }),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.code !== 0) {
      console.error("Token Error", tokenData);
      return NextResponse.json(
        { success: false, message: "인증 토큰 발급 실패" },
        { status: 500 }
      );
    }
    const { access_token } = tokenData.response;

    // 2. Verify Account Name
    // Using PortOne (I'mport) API for Depositor Inquiry
    const verifyRes = await fetch(
      `https://api.iamport.kr/vbanks/holder?bank_code=${standardBankCode}&bank_num=${accountNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const verifyData = await verifyRes.json();
    console.log("verifyData Response:", JSON.stringify(verifyData, null, 2));

    if (verifyData.code !== 0) {
      // 0 is success in PortOne standard responses usually, or check documentation specifics.
      // Actually v2/inquiry/depositor might return response directly or wrap it.
      // Standard PortOne: code 0 = success.
      return NextResponse.json(
        { 
          success: false, 
          message: verifyData.message || "예금주 조회에 실패했습니다. (정보 불일치 등)" 
        },
        { status: 400 }
      );
    }

    // Success
    const { bank_holder } = verifyData.response;

    return NextResponse.json({
      success: true,
      verifiedName: bank_holder,
    });

  } catch (error) {
    console.error("Verify API Error:", error);
    return NextResponse.json(
      { success: false, message: "계좌 조회 중 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
