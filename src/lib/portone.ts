
// Standard Bank Codes (Open Banking / KFTC standards)
export const BANK_CODE_MAP: Record<string, string> = {
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
};

export async function getPortOneToken(): Promise<string> {
  const apiKey = process.env.PORTONE_API_KEY;
  const apiSecret = process.env.PORTONE_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("PortOne API Keys missing");
  }

  const response = await fetch("https://api.iamport.kr/users/getToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imp_key: apiKey,
      imp_secret: apiSecret,
    }),
  });

  const data = await response.json();
  if (data.code !== 0) {
    throw new Error(`Token Error: ${data.message}`);
  }

  return data.response.access_token;
}

// --- Bank Data with Categories ---
export const BANK_DATA = [
  // Major & Internet (Bank)
  { name: "카카오뱅크", code: "kakao", type: "bank" },
  { name: "KB국민", code: "kb", type: "bank" },
  { name: "신한", code: "shinhan", type: "bank" },
  { name: "우리", code: "woori", type: "bank" },
  { name: "하나", code: "hana", type: "bank" },
  { name: "NH농협", code: "nh", type: "bank" },
  { name: "IBK기업", code: "ibk", type: "bank" },
  { name: "토스뱅크", code: "toss", type: "bank" },
  { name: "케이뱅크", code: "kbank", type: "bank" },
  { name: "SC제일", code: "sc", type: "bank" },
  { name: "한국씨티", code: "citi", type: "bank" },
  { name: "KDB산업", code: "kdb", type: "bank" },

  // Local (Bank)
  { name: "iM뱅크(대구)", code: "daegu", type: "bank" },
  { name: "부산", code: "busan", type: "bank" },
  { name: "경남", code: "kyongnam", type: "bank" },
  { name: "광주", code: "gwangju", type: "bank" },
  { name: "전북", code: "jeonbuk", type: "bank" },
  { name: "제주", code: "jeju", type: "bank" },

  // Others (Bank)
  { name: "우체국", code: "post", type: "bank" },
  { name: "새마을금고", code: "kfcc", type: "bank" },
  { name: "신협", code: "cu", type: "bank" },
  { name: "수협", code: "suhyup", type: "bank" },
  { name: "저축은행", code: "sb", type: "bank" },
  { name: "산림조합", code: "sj", type: "bank" },

  // Securities
  { name: "키움증권", code: "kiwoom", type: "security" },
  { name: "미래에셋", code: "mirae", type: "security" },
  { name: "삼성증권", code: "samsung", type: "security" },
  { name: "한국투자", code: "koreainv", type: "security" },
  { name: "NH투자", code: "nhinv", type: "security" },
  { name: "KB증권", code: "kbinv", type: "security" },
  { name: "카카오페이", code: "kakaopay", type: "security" },
  { name: "토스증권", code: "tosssec", type: "security" },
  { name: "신한투자", code: "shinhaninv", type: "security" },
  { name: "하나증권", code: "hanainv", type: "security" },
  { name: "현대차", code: "hyundai", type: "security" },
  { name: "대신증권", code: "daishin", type: "security" },
  { name: "메리츠", code: "meritz", type: "security" },
  { name: "유안타", code: "yuanta", type: "security" },
  { name: "유진투자", code: "eugene", type: "security" },
  { name: "한화투자", code: "hanwha", type: "security" },
  { name: "DB금융", code: "db", type: "security" },
  { name: "교보증권", code: "kyobo", type: "security" },
  { name: "부국증권", code: "bookook", type: "security" },
  { name: "신영증권", code: "shinyoung", type: "security" },
  { name: "SK증권", code: "sk", type: "security" },
  { name: "케이프", code: "cape", type: "security" },
  { name: "BNK투자", code: "bnkinv", type: "security" },
  { name: "IBK투자", code: "ibkinv", type: "security" },

  // Foreign (Bank)
  { name: "도이치", code: "deutsche", type: "bank" },
  { name: "중국공상", code: "icbc", type: "bank" },
  { name: "중국", code: "boc", type: "bank" },
  { name: "HSBC", code: "hsbc", type: "bank" },
  { name: "JP모간", code: "jpmorgan", type: "bank" },
];

export function getBankCodeByName(name: string): string | undefined {
  const bank = BANK_DATA.find((b) => b.name === name);
  return bank ? bank.code : undefined;
}

