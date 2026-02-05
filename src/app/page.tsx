import { LiveTransactionTicker } from "@/components/LiveTransactionTicker";
import { GlassmorphismHero } from "@/components/GlassmorphismHero";
import { ProductGrid } from "@/components/ProductGrid";
import { OrderForm } from "@/components/OrderForm";
import { RealtimeStatus } from "@/components/RealtimeStatus";
import { NoticeList } from "@/components/NoticeList";
import { TrustBadges } from "@/components/TrustBadges";
import { ServiceNotice } from "@/components/ServiceNotice";

import { PurchaseProvider } from "@/context/PurchaseContext";

export default function Home() {
  return (
    <PurchaseProvider>
      <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950">
        <LiveTransactionTicker />

        <main className="flex-1 pb-24">
          <GlassmorphismHero />

          {/* Contents Wrapper with negative margin for overlap effect */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 space-y-12">
            {/* Trust Badges - Placed here to bridge Hero and Content */}
            <div className="relative">
              <TrustBadges />
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                  <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                    오늘의 매입 시세
                  </h2>
                  <ProductGrid />
                </div>

                {/* Content Grid */}
                <ServiceNotice />

                {/* Bottom Grid: Status & Notices */}
                <div className="grid md:grid-cols-2 gap-6">
                  <RealtimeStatus />
                  <NoticeList />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-slate-100 overflow-hidden">
                    <div className="bg-slate-900 px-6 py-4 border-b border-slate-800">
                      <h3 className="text-white font-bold flex items-center gap-2">
                        ⚡ 빠른 교환 신청
                      </h3>
                    </div>
                    <div className="p-2">
                      <OrderForm />
                    </div>
                  </div>

                  {/* Kakao Banner */}
                  <div className="bg-[#FAE100] rounded-2xl p-6 flex items-center justify-center gap-4 shadow-lg shadow-[#FAE100]/30 cursor-pointer hover:bg-[#FCE620] transition-colors group transform hover:-translate-y-1">
                    <div className="bg-[#3C1E1E] text-[#FAE100] font-bold rounded px-2 py-1 text-xs group-hover:scale-105 transition-transform">
                      TALK
                    </div>
                    <div className="text-[#3C1E1E] font-bold text-lg">
                      카카오톡 상담하기
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PurchaseProvider>
  );
}
