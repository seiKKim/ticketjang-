import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Activity,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [pendingCount, verifyingCount, todayStats] = await Promise.all([
    prisma.transaction.count({ where: { status: "PENDING" } }),
    prisma.transaction.count({ where: { status: "VERIFYING" } }),
    prisma.transaction.aggregate({
      where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      _sum: { totalFaceValue: true, margin: true },
      _count: { id: true },
    }),
  ]);

  const actionRequired = pendingCount + verifyingCount;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Admin Dashboard
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            오늘 하루도 힘내세요, 관리자님! 👋
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-sm font-bold text-slate-600">
          <Activity className="w-4 h-4 text-indigo-500" />
          <span>{new Date().toLocaleDateString()} 실시간 현황</span>
        </div>
      </div>

      {/* Action Required Banner - Glass Style */}
      {actionRequired > 0 ? (
        <div className="relative bg-gradient-to-r from-orange-500 to-rose-500 rounded-3xl p-1 shadow-lg shadow-orange-500/20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          <div className="bg-white/95 backdrop-blur-sm rounded-[1.3rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-orange-100 rounded-2xl animate-pulse">
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1">
                  처리 대기중인 거래가{" "}
                  <span className="text-orange-600">{actionRequired}건</span>{" "}
                  있습니다!
                </h3>
                <p className="text-slate-500 font-medium">
                  빠른 승인 처리가 고객 만족도를 높입니다. (접수: {pendingCount}
                  , 검증중: {verifyingCount})
                </p>
              </div>
            </div>
            <Link
              href="/admin/transactions"
              className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap"
            >
              거래 관리로 이동 <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-indigo-500 to-sky-500 p-1 rounded-3xl shadow-lg shadow-indigo-500/20">
          <div className="bg-white/95 backdrop-blur-sm rounded-[1.3rem] p-6 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-indigo-50 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-1">
                  모든 거래가 처리되었습니다.
                </h3>
                <p className="text-slate-500 font-medium">
                  현재 대기중인 건이 없습니다. 편안한 시간 보내세요! ☕
                </p>
              </div>
            </div>
            <Link
              href="/admin/transactions"
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              전체 거래 조회 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="오늘 총 거래금액"
          value={`${(todayStats._sum.totalFaceValue || 0).toLocaleString()}원`}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          gradient="from-blue-500 to-indigo-600"
          trend="+12% 증가"
        />
        <DashboardCard
          title="오늘 예상 수익"
          value={`${(todayStats._sum.margin || 0).toLocaleString()}원`}
          icon={<Activity className="w-6 h-6 text-white" />}
          gradient="from-emerald-400 to-teal-500"
          trend="+5% 증가"
        />
        <DashboardCard
          title="오늘 처리 건수"
          value={`${(todayStats._count.id || 0).toLocaleString()}건`}
          icon={<CheckCircle2 className="w-6 h-6 text-white" />}
          gradient="from-violet-500 to-purple-600"
          trend="안정적"
        />
      </div>

      {/* Quick Links / Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
            🚀 빠른 이동
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/rates"
              className="p-5 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-100 border border-slate-100 rounded-2xl transition-all group text-center"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                📊
              </div>
              <div className="font-bold text-slate-700 group-hover:text-indigo-700">
                시세 관리
              </div>
            </Link>
            <Link
              href="/admin/stats"
              className="p-5 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-100 border border-slate-100 rounded-2xl transition-all group text-center"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                📈
              </div>
              <div className="font-bold text-slate-700 group-hover:text-indigo-700">
                매출 통계
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow">
          <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
            ⚡ 시스템 상태
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-600 font-bold">데이터베이스</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                연결됨
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-slate-600 font-bold">마지막 백업</span>
              </div>
              <span className="text-xs font-medium text-slate-400">
                03:00 AM (Auto)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
  gradient,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  trend: string;
}) {
  return (
    <div className="relative group overflow-hidden bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div
        className={`absolute top-0 right-0 p-20 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-[100px] transition-opacity group-hover:opacity-10`}
      />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div
          className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
          {trend}
        </span>
      </div>

      <div className="relative z-10">
        <p className="text-slate-500 font-medium text-sm mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );
}
