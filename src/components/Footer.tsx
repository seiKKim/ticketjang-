"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AdminLoginModal } from "./AdminLoginModal";

export function Footer() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-white border-t border-slate-100 text-slate-500 text-xs py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="mb-4">
              <Image
                src="/images/logo.png"
                alt="티켓대장 로고"
                width={100}
                height={30}
                className="h-10 w-auto object-contain"
              />
            </div>
            <div className="space-y-1.5 text-slate-500 leading-relaxed">
              <p>상호명: 당당상품권 | 대표자: 문태우</p>
              <p>
                사업자등록번호: 349-60-00215 | 통신판매업신고:
                2024-고양일산동-0441
              </p>
              <p>주소: 경기도 고양시 일산동구 장항로 203-138</p>
              <p>전화: 010-2351-3200 | 이메일: help@dangdang.com</p>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 leading-relaxed">
              * 당당상품권은 상품권을 직접 발행하지 않으며, 제휴사를 통해 정식
              유통되는 상품권만을 취급합니다.
              <br />* 자금세탁 및 불법 거래 의심 시 즉시 거래가 제한될 수
              있습니다.
            </p>
          </div>

          <div className="md:text-right space-y-6">
            <div className="inline-block text-left bg-soft-gradient p-6 rounded-2xl border border-indigo-50 shadow-sm">
              <p className="text-indigo-900/60 font-semibold mb-2 text-xs">
                고객센터 (365일 24시간)
              </p>
              <p className="text-3xl font-extrabold text-indigo-900 tracking-tight">
                010-2351-3200
              </p>
              <div className="mt-4 flex gap-3">
                <button className="bg-[#FAE100] text-[#3C1E1E] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#FCE620] transition-colors shadow-sm">
                  카카오톡 문의
                </button>
                <button className="bg-white text-indigo-600 border border-indigo-100 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                  텔레그램 문의
                </button>
              </div>
            </div>
            <p className="text-slate-400 text-[11px]">
              Copyright © 2025 Ticket Jang. All rights reserved.
              <span className="mx-2">|</span>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="hover:text-slate-600 transition-colors"
                type="button"
              >
                Admin Access
              </button>
            </p>
          </div>
        </div>
      </footer>

      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
