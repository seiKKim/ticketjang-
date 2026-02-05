"use client";

import Link from "next/link";
import Image from "next/image";
import { User, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-indigo-50 sticky top-0 z-50 shadow-sm transition-all">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            replace={pathname?.startsWith("/admin")}
            className="flex items-center gap-1"
          >
            <Image
              src="/images/logo.png"
              alt="티켓대장 로고"
              width={120}
              height={40}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <Link
              href="/rates"
              replace={pathname?.startsWith("/admin")}
              className="hover:text-primary transition-colors"
            >
              시세표
            </Link>
            <Link
              href="/guide"
              replace={pathname?.startsWith("/admin")}
              className="hover:text-primary transition-colors"
            >
              이용안내
            </Link>
            <Link
              href="/cs"
              replace={pathname?.startsWith("/admin")}
              className="hover:text-primary transition-colors"
            >
              고객센터
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 mr-2 bg-indigo-50/50 px-3 py-1 rounded-full border border-indigo-100/50">
            <span>🕒 24시간 연중무휴</span>
          </div>
          <button className="bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white text-sm font-bold px-5 py-2 rounded-full transition-all shadow-sm hover:shadow-md hidden sm:block">
            내 주문조회
          </button>
          <button
            className="p-2 sm:hidden text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-20 px-6 sm:hidden animate-in slide-in-from-top-10 fade-in duration-200">
          <nav className="flex flex-col gap-6 text-lg font-medium text-slate-800">
            <Link
              href="/rates"
              replace={pathname?.startsWith("/admin")}
              className="py-2 border-b border-slate-100 flex justify-between items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              시세표 <span className="text-slate-300">›</span>
            </Link>
            <Link
              href="/guide"
              replace={pathname?.startsWith("/admin")}
              className="py-2 border-b border-slate-100 flex justify-between items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              이용안내 <span className="text-slate-300">›</span>
            </Link>
            <Link
              href="/cs"
              replace={pathname?.startsWith("/admin")}
              className="py-2 border-b border-slate-100 flex justify-between items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              고객센터 <span className="text-slate-300">›</span>
            </Link>
            <button className="mt-4 w-full bg-slate-900 text-white py-3 rounded-xl font-bold shadow-lg shadow-slate-200">
              내 주문조회
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
