import { Ticket, Gift, MonitorPlay } from "lucide-react";
import { ComponentProps } from "react";

export function BookIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

export const VOUCHERS = [
  {
    id: "culture",
    name: "컬쳐랜드(16핀)",
    validatorCode: "CULTURE_LAND",
    icon: Ticket,
    imagePath: "/images/icons/culture.png",
    category: "online",
    color: "text-red-500 bg-red-50",
    purchaseRate: "90%",
    listPrice: "90%",
    fee: "10%",
    status: "매입중",
    pinSegments: [4, 4, 4, 4],
  },
  {
    id: "culture_cash",
    name: "문화상품권(18핀)",
    validatorCode: "CULTURE_CASH",
    icon: Ticket,
    imagePath: "/images/icons/culture.png",
    category: "online",
    color: "text-red-500 bg-red-50",
    purchaseRate: "88%",
    listPrice: "88%",
    fee: "12%",
    status: "매입중",
    pinSegments: [4, 4, 4, 6],
  },
  {
    id: "culture_exch",
    name: "컬쳐랜드(교환권)",
    validatorCode: "CULTURE_EXCH",
    icon: Ticket,
    imagePath: "/images/icons/culture.png",
    category: "mobile",
    color: "text-red-500 bg-red-50",
    purchaseRate: "88%",
    listPrice: "88%",
    fee: "12%",
    status: "매입중",
    pinSegments: [4, 4, 4, 4],
  },
  {
    id: "culture_cash_exch",
    name: "문화상품권(교환권)",
    validatorCode: "CULTURE_CASH_EXCH",
    icon: Ticket,
    imagePath: "/images/icons/culture.png",
    category: "mobile",
    color: "text-red-500 bg-red-50",
    purchaseRate: "88%",
    listPrice: "88%",
    fee: "12%",
    status: "매입중",
  },
  {
    id: "teencash",
    name: "틴캐시",
    validatorCode: "TEEN_CASH",
    icon: Ticket,
    imagePath: "/images/icons/teencash.png",
    category: "online",
    color: "text-yellow-500 bg-yellow-50",
    purchaseRate: "88%",
    listPrice: "88%",
    fee: "12%",
    status: "매입중",
    pinSegments: [4, 4, 4],
  },
  {
    id: "book",
    name: "북앤라이프\n도서문화상품권",
    validatorCode: "BOOK_NLIFE",
    icon: BookIcon,
    imagePath: "/images/icons/book.png",
    category: "online",
    color: "text-orange-500 bg-orange-50",
    purchaseRate: "89%",
    listPrice: "89%",
    fee: "11%",
    status: "매입중",
    pinSegments: [4, 4, 4, 4],
  },
  {
    id: "google",
    name: "구글\n기프트카드 교환권",
    validatorCode: "GOOGLE_GIFT",
    icon: MonitorPlay,
    imagePath: "/images/icons/google.png",
    category: "mobile",
    color: "text-blue-500 bg-blue-50",
    purchaseRate: "90%",
    listPrice: "90%",
    fee: "10%",
    status: "매입중",
    pinSegments: [4, 4, 4, 4],
  },
  {
    id: "lotte",
    name: "롯데\n모바일 교환권",
    validatorCode: "LOTTE",
    icon: Gift,
    imagePath: "/images/icons/lotte.png",
    category: "department",
    color: "text-red-600 bg-red-50",
    purchaseRate: "92%",
    listPrice: "92%",
    fee: "8%",
    status: "매입중",
    pinSegments: [4, 4, 4, 4],
  },
  {
    id: "shinsegae",
    name: "신세계\n모바일 상품권",
    validatorCode: "SHINSEGAE",
    icon: Gift,
    imagePath: "/images/icons/shinsegae.png",
    category: "department",
    color: "text-pink-600 bg-pink-50",
    purchaseRate: "93%",
    listPrice: "93%",
    fee: "7%",
    status: "매입중",
    pinSegments: [4, 4, 4, 4],
  },
  {
    id: "starbucks",
    name: "스타벅스\ne카드 교환권",
    validatorCode: "STARBUCKS",
    icon: Gift,
    imagePath: "/images/icons/starbucks.png",
    category: "mobile",
    color: "text-green-600 bg-green-50",
    purchaseRate: "91%",
    listPrice: "91%",
    fee: "9%",
    status: "매입중",
    pinSegments: [4, 4, 4, 4, 8],
  },
];
