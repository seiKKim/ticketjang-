"use client";

import { AlertTriangle, FileText, Megaphone, TrendingUp } from "lucide-react";

export function ServiceNotice() {
  return (
    <div className="relative group overflow-hidden bg-white rounded-3xl p-8 shadow-xl shadow-indigo-100 border border-indigo-100 transition-all hover:shadow-2xl hover:shadow-indigo-200/50">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Megaphone className="w-32 h-32 text-indigo-900 -rotate-12" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-bounce-slow">
          <Megaphone className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            잠깐! 교환 전 <span className="text-indigo-600">필독사항</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            안전하고 빠른 교환을 위해 꼭 확인해주세요
          </p>
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-4 relative z-10">
        <NoticeItem
          icon={<FileText className="w-4 h-4 text-emerald-500" />}
          title="정보 입력은 정확하게!"
          desc="계좌번호 예금주가 일치해야 즉시 입금됩니다."
          color="bg-emerald-50 border-emerald-100"
        />
        <NoticeItem
          icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
          title="타인 계좌 입금 불가"
          desc="본인 명의의 계좌로만 입금이 가능합니다."
          color="bg-amber-50 border-amber-100"
        />
        <NoticeItem
          icon={<TrendingUp className="w-4 h-4 text-rose-500" />}
          title="실시간 시세 변동"
          desc="매입가는 시장 상황에 따라 변동될 수 있습니다."
          color="bg-rose-50 border-rose-100"
        />
      </div>
    </div>
  );
}

function NoticeItem({
  icon,
  title,
  desc,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-2xl border ${color} transition-transform hover:scale-[1.02]`}
    >
      <div className="bg-white p-2 rounded-xl shadow-sm shrink-0">{icon}</div>
      <div>
        <h4 className="text-slate-900 font-bold text-sm mb-0.5">{title}</h4>
        <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
