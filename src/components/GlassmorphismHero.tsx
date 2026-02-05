"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { usePurchase } from "@/context/PurchaseContext";

export function GlassmorphismHero() {
  const { selectedVoucher } = usePurchase();
  const [amount, setAmount] = useState<string>("50000");

  const rawValue = parseInt(amount.replace(/,/g, ""), 10) || 0;

  // Parse rate string (e.g., "90%") to decimal (0.90)
  const rateString = selectedVoucher?.purchaseRate || "91%";
  const rateDecimal = parseFloat(rateString.replace("%", "")) / 100;

  const calculated = Math.floor(rawValue * rateDecimal);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic number formatting
    const val = e.target.value.replace(/\D/g, "");
    setAmount(Number(val).toLocaleString());
  };

  return (
    <section className="relative pt-20 pb-32 px-6 overflow-hidden bg-[#0f172a] min-h-[600px] flex items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-pink-500/20 rounded-full blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left: Text Content */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-indigo-200 text-xs font-bold tracking-wide uppercase">
              Live Exchange Active
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight">
            Exchange <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400">
              Value Instantly
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
            잠자는 상품권을 깨우세요. <br className="hidden md:block" />
            업계 최고 매입률 91% 보장, 단 3분이면 통장으로 입금됩니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/purchase"
              className="group relative px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-50 via-white to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                지금 교환하기{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
            <div className="text-center lg:text-left">
              <h3 className="text-white font-bold text-2xl">3min</h3>
              <p className="text-slate-500 text-sm">평균 소요 시간</p>
            </div>
            <div className="text-center lg:text-left">
              <h3 className="text-emerald-400 font-bold text-2xl">24/7</h3>
              <p className="text-slate-500 text-sm">365일 연중무휴</p>
            </div>
            <div className="text-center lg:text-left">
              <h3 className="text-sky-400 font-bold text-2xl">99%</h3>
              <p className="text-slate-500 text-sm">고객 만족도</p>
            </div>
          </div>
        </div>

        {/* Right: Glassmorphism Calculator */}
        <div className="relative">
          {/* Floating Elements (Visuals) */}
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-2xl rotate-12 blur-sm opacity-60 animate-[bounce_3s_infinite]" />
          <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full blur-sm opacity-60 animate-[bounce_4s_infinite]" />

          <div className="relative bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-white font-bold text-xl flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-indigo-400" />
                  미리 계산하기
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  {selectedVoucher ? selectedVoucher.name : "상품권"} 실시간
                  시세 적용
                </p>
              </div>
              <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-500/20">
                {rateString} 적용중
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium ml-1">
                  상품권 금액 (원)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    title="상품권 금액 입력"
                    placeholder="50,000"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-4 px-4 text-white text-lg font-bold outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-right"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                    ₩
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="bg-slate-800 rounded-full p-2 border border-white/5">
                  <ArrowRight className="w-5 h-5 text-slate-500 rotate-90" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-emerald-400 text-sm font-bold ml-1 flex justify-between">
                  <span>입금 예정 금액</span>
                  <span className="text-xs font-normal opacity-70">
                    수수료 포함
                  </span>
                </label>
                <div className="w-full bg-gradient-to-r from-indigo-900/40 to-slate-900/40 border border-indigo-500/30 rounded-xl py-4 px-4 text-right">
                  <span className="text-3xl font-black text-white tracking-tight text-shadow-glow">
                    {calculated.toLocaleString()}
                  </span>
                  <span className="text-slate-400 text-sm ml-1">원</span>
                </div>
              </div>

              <Link
                href="/purchase"
                className="block w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl text-center shadow-lg shadow-indigo-900/50 transition-all hover:scale-[1.02]"
              >
                {selectedVoucher ? selectedVoucher.name : ""} 교환 신청하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
