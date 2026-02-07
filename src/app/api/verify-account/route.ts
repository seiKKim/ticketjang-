import { NextResponse } from "next/server";
import { getPortOneToken, BANK_CODE_MAP } from "@/lib/portone";

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

    // 1. Get Access Token
    const access_token = await getPortOneToken();

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
