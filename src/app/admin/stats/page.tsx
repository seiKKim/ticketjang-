import { prisma } from "@/lib/prisma";
import { TrendingUp, Users, Wallet, CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Aggregate Stats
  const [totalStats, todayStats] = await Promise.all([
    prisma.transaction.aggregate({
      where: { status: "COMPLETED" },
      _sum: {
        totalFaceValue: true,
        margin: true,
      },
      _count: { id: true },
    }),
    prisma.transaction.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: { gte: startOfDay },
      },
      _sum: {
        totalFaceValue: true,
        margin: true,
      },
      _count: { id: true },
    }),
  ]);

  const totalVolume = totalStats._sum.totalFaceValue || 0;
  const totalProfit = totalStats._sum.margin || 0;
  const totalCount = totalStats._count.id || 0;

  const todayVolume = todayStats._sum.totalFaceValue || 0;
  const todayProfit = todayStats._sum.margin || 0;
  const todayCount = todayStats._count.id || 0;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">매출 통계</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="총 매입금액"
          value={`${totalVolume.toLocaleString()}원`}
          subValue={`오늘 ${todayVolume.toLocaleString()}원`}
          icon={<Wallet className="text-indigo-600" />}
          trend={todayVolume > 0 ? "up" : "neutral"}
        />
        <StatCard
          title="총 수익 (마진)"
          value={`${totalProfit.toLocaleString()}원`}
          subValue={`오늘 ${todayProfit.toLocaleString()}원`}
          icon={<TrendingUp className="text-emerald-600" />}
          trend={todayProfit > 0 ? "up" : "neutral"}
        />
        <StatCard
          title="완료된 거래"
          value={`${totalCount.toLocaleString()}건`}
          subValue={`오늘 ${todayCount.toLocaleString()}건`}
          icon={<CreditCard className="text-blue-600" />}
          trend="neutral"
        />
        <StatCard
          title="평균 매입단가"
          value={
            totalCount > 0
              ? `${Math.round(totalVolume / totalCount).toLocaleString()}원`
              : "0원"
          }
          subValue="건당 평균"
          icon={<Users className="text-orange-600" />}
          trend="neutral"
        />
      </div>

      {/* Recent Activity (Mock Chart Area) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-64 flex items-center justify-center text-slate-400">
        차트 데이터가 준비되면 이곳에 표시됩니다. (현재 데이터 부족)
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subValue: string;
  icon: React.ReactNode;
  trend: "up" | "neutral" | "down";
}

function StatCard({ title, value, subValue, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-500 font-medium text-sm">{title}</h3>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      <div
        className={`text-xs ${trend === "up" ? "text-emerald-600" : "text-slate-400"}`}
      >
        {subValue}
      </div>
    </div>
  );
}
