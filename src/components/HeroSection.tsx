import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="bg-soft-gradient pt-16 pb-24 px-6 relative overflow-visible">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        <div className="text-center md:text-left space-y-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full text-sm font-bold text-indigo-600 mb-2 border border-indigo-100 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            대한민국 1등 상품권 교환소
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight text-slate-900 tracking-tight">
            잠자는데 안 쓰는 상품권 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-sky-500">
              3분 만에 현금으로?
            </span>
          </h1>

          <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed">
            복잡한 절차 없이 핀번호만 입력하세요.
            <br className="hidden md:block" />
            365일 24시간, 티켓대장이 즉시 입금해드립니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
            <Link
              href="/purchase"
              className="bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white text-lg font-bold px-10 py-4 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all hover:-translate-y-1"
            >
              교환 신청하기 <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/rates"
              className="bg-white text-slate-700 hover:text-indigo-600 border border-slate-200 hover:border-indigo-100 text-lg font-bold px-10 py-4 rounded-2xl shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all"
            >
              실시간 시세 보기
            </Link>
          </div>
        </div>

        {/* 3D Illustration Area */}
        <div className="relative w-full max-w-sm md:max-w-md aspect-square">
          <div className="absolute inset-0 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

          <div className="relative z-10 w-full h-full">
            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-100/50 border border-white transform hover:scale-[1.02] transition-transform duration-500">
              <Image
                src="/images/hero-cafe.png"
                alt="TicketJang Cafe Atmosphere"
                fill
                className="object-cover"
                priority
              />

              {/* Overlay Content if needed, or keeping it clean */}
            </div>

            {/* Floating Badges */}
            <div className="absolute -top-6 -right-6 bg-white text-slate-800 px-5 py-3 rounded-2xl shadow-xl shadow-indigo-100/50 font-bold flex items-center gap-2 animate-bounce border border-slate-50">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <span>입금완료!</span>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white text-slate-800 px-5 py-3 rounded-2xl shadow-xl shadow-indigo-100/50 font-bold flex items-center gap-2 animate-bounce animation-delay-500 border border-slate-50">
              <span className="text-indigo-500 text-lg">★</span>
              <span>3분 컷</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
