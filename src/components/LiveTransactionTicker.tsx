"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

// Mock data generator for "Live" feeling
const NAMES = ["김*수", "이*영", "박*호", "최*진", "정*우", "강*민", "윤*서"];
const ACTIONS = [
  "문화상품권 5만원 교환",
  "신세계상품권 10만원 교환",
  "해피머니 3만원 교환",
  "구글기프트 1만원 교환",
];
const TIMES = ["방금 전", "1분 전", "2분 전"];

interface Transaction {
  id: number;
  text: string;
  time: string;
}

export function LiveTransactionTicker() {
  // Initialize directly since data is deterministic (safe for SSR)
  const [items] = useState<Transaction[]>(() =>
    Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      text: `${NAMES[i % NAMES.length]}님 ${ACTIONS[i % ACTIONS.length]} 완료!`,
      time: TIMES[0],
    })),
  );

  // No longer need mounted check since we don't have hydration mismatch issues

  return (
    <div className="bg-slate-900 border-b border-indigo-900/50 text-white h-10 flex items-center overflow-hidden relative z-50">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent z-10" />

      <div className="flex gap-4 items-center px-4 animate-ticker whitespace-nowrap">
        {[...items, ...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-xs md:text-sm text-slate-300"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span className="font-bold text-white">{item.text}</span>
            <span className="text-slate-500 text-[10px]">{item.time}</span>
            <span className="w-1 h-1 rounded-full bg-slate-700 mx-2" />
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
