"use client";

import { useEffect, useState } from "react";

const MOCK_RATES = [
  { name: "문화상품권", rate: 90 },
  { name: "해피머니", rate: 90 },
  { name: "구글기프트", rate: 85 },
  { name: "북앤라이프", rate: 88 },
  { name: "롯데상품권", rate: 94 },
  { name: "신세계상품권", rate: 94 },
];

export function RateTicker() {
  // In a real app, optimize this animation or use a library
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white h-10 flex items-center overflow-hidden relative shadow-sm border-b border-indigo-700/50">
      <div className="animate-ticker whitespace-nowrap flex gap-8 px-4 w-full">
        {/* Duplicate list for infinite scroll simulation */}
        {[...MOCK_RATES, ...MOCK_RATES, ...MOCK_RATES].map((item, idx) => (
          <span
            key={idx}
            className="text-sm font-medium flex items-center gap-1"
          >
            <span className="text-slate-300">{item.name}</span>
            <span className="text-green-400 font-bold">{item.rate}%</span>
          </span>
        ))}
      </div>

      <style jsx>{`
        .animate-ticker {
          animation: ticker 20s linear infinite;
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
