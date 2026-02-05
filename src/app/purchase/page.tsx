"use client";

import { PurchaseProvider } from "@/context/PurchaseContext";
import { ProductGrid } from "@/components/ProductGrid";
import { OrderForm } from "@/components/OrderForm";
import { AlertCircle } from "lucide-react";
import { SubPageHero } from "@/components/SubPageHero";

export default function PurchasePage() {
  return (
    <PurchaseProvider>
      <div className="min-h-screen bg-[#f1f2f6] dark:bg-dark-bg transition-colors duration-300 relative overflow-hidden">
        {/* Background Blobs for specific softness */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-pink-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Premium Header Section */}
        <SubPageHero
          title="상품권 판매하기"
          description={
            <>
              가장 안전한{" "}
              <span className="text-emerald-400 font-bold">
                공식 인증 거래소
              </span>
              에서
              <br className="hidden sm:block" />
              수수료 걱정 없이 빠르게 교환하세요.
            </>
          }
          badgeText="실시간 매입 시스템 가동중"
          category="Purchase"
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-20 -mt-24">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Product Selection */}
            <div
              className="lg:col-span-2 space-y-8 animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <ProductGrid />

              {/* Info Box - Enhanced with Glassmorphism */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/50 relative overflow-hidden group hover:shadow-xl transition-all duration-300 ring-1 ring-white/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:bg-indigo-100 transition-colors" />

                <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-6 text-lg relative z-10">
                  <div className="bg-indigo-100/50 p-2 rounded-lg backdrop-blur-md">
                    <AlertCircle className="w-5 h-5 text-indigo-600" />
                  </div>
                  안전한 거래를 위한 체크포인트
                </h3>

                <div className="space-y-4 relative z-10">
                  <div className="flex gap-4 items-start p-4 rounded-2xl bg-white/60 border border-white/50 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold mt-0.5 shadow-lg shadow-indigo-200">
                      1
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">
                        정확한 정보 입력
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        현금교환 신청서는 정확한 정보로 작성해주시기 바랍니다.
                        잘못된 정보입력으로 인한 책임은 본인에게 있습니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-4 rounded-2xl bg-white/60 border border-white/50 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold mt-0.5 shadow-lg shadow-indigo-200">
                      2
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">
                        매입가 변동 주의
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        매입가는 시장 상황에 따라 실시간으로 변동될 수 있습니다.
                        신청 시점의 시세가 적용됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Form */}
            <div
              className="lg:col-span-1 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="sticky top-24 space-y-6">
                <OrderForm />

                {/* Kakao Banner - Enhanced */}
                <a
                  href="https://open.kakao.com/o/sBGwZRci/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FAE100]/90 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-lg shadow-[#FAE100]/20 cursor-pointer hover:bg-[#FCE620] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden border border-white/20 block"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />

                  <div className="flex items-center gap-2">
                    <div className="bg-[#3C1E1E] text-[#FAE100] font-bold rounded px-2 py-0.5 text-[10px]">
                      24시간 상담
                    </div>
                    <span className="text-xs font-bold text-[#3C1E1E]/70">
                      평균 응답 3분
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-[#3C1E1E] w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg group-hover:scale-110 transition-transform">
                      talk
                    </div>
                    <div className="text-left">
                      <div className="text-[#3C1E1E] font-black text-lg leading-none">
                        카카오톡 고객센터
                      </div>
                      <div className="text-[#3C1E1E]/80 text-xs font-bold mt-0.5 group-hover:underline">
                        문의하러 가기 &rarr;
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PurchaseProvider>
  );
}
