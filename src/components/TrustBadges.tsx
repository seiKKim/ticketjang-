import { ShieldCheck, Clock, Award, HeadphonesIcon } from "lucide-react";

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
      <Badge
        icon={<ShieldCheck className="w-8 h-8 text-emerald-500" />}
        title="SSL 보안 적용"
        desc="개인정보 암호화"
      />
      <Badge
        icon={<Clock className="w-8 h-8 text-indigo-500" />}
        title="5분 내 입금"
        desc="자동이체 시스템"
      />
      <Badge
        icon={<Award className="w-8 h-8 text-amber-500" />}
        title="정식 등록업체"
        desc="국세청 사업자인증"
      />
      <Badge
        icon={<HeadphonesIcon className="w-8 h-8 text-sky-500" />}
        title="24시 상담"
        desc="연중무휴 고객센터"
      />
    </div>
  );
}

function Badge({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform duration-300">
      <div className="p-3 bg-slate-50 rounded-full">{icon}</div>
      <div>
        <h4 className="font-bold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
      </div>
    </div>
  );
}
