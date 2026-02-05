"use client";

import { useEffect, useState, useRef } from "react";

const MOCK_TRANSACTIONS = [
  { id: 1, type: "컬쳐랜드 문화상품권", uesr: "정*영", status: "입금완료" },
  { id: 2, type: "해피머니 상품권", uesr: "김*수", status: "입금완료" },
  { id: 3, type: "북앤라이프 도서문화", uesr: "이*민", status: "입금완료" },
  { id: 4, type: "구글 기프트카드", uesr: "박*호", status: "입금완료" },
  { id: 5, type: "신세계 모바일 교환권", uesr: "최*진", status: "입금완료" },
  { id: 6, type: "컬쳐랜드 문화상품권", uesr: "강*우", status: "입금완료" },
  { id: 7, type: "해피머니 상품권", uesr: "윤*비", status: "입금완료" },
  { id: 8, type: "롯데 모바일 상품권", uesr: "임*준", status: "입금완료" },
];

export function RealtimeStatus() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll logic (simple CSS animation is better, but JS allows pause on hover)
  // For now, using CSS animation via Tailwind class extensions or custom styles

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          실시간 진행 현황
        </h2>
        <span className="text-xs text-slate-400">최근 매입 현황입니다.</span>
      </div>

      <div className="overflow-hidden h-[300px] relative">
        <div className="animate-vertical-scroll space-y-4">
          {/* Duplicate for infinite loop */}
          {[
            ...MOCK_TRANSACTIONS,
            ...MOCK_TRANSACTIONS,
            ...MOCK_TRANSACTIONS,
          ].map((tx, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm py-1 border-b border-dashed border-slate-100 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">
                  {tx.type[0]}
                </span>
                <span className="text-slate-600 font-medium truncate max-w-[140px]">
                  {tx.type}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-400 text-xs">{tx.uesr}님</span>
                <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded text-xs font-bold">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Gradient Overlay for Fade Effect */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      <style jsx>{`
        .animate-vertical-scroll {
          animation: verticalScroll 20s linear infinite;
        }
        @keyframes verticalScroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
      `}</style>
    </div>
  );
}
