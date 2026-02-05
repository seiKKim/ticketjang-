import { VOUCHERS } from "@/lib/constants";
import { prisma } from "@/lib/prisma"; // Direct DB access for Server Component
import { AlertCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SubPageHero } from "@/components/SubPageHero";

// Mapping frontend constants IDs to DB VoucherTypes
// Now we use the ID directly as the DB key

export const dynamic = "force-dynamic";

export default async function RatesPage() {
  // Fetch real rates from DB (Active only)
  const dbRates = await prisma.rate.findMany({
    where: { isActive: true },
  });

  // Create lookup map: Type -> Rate (0.90)
  const rateMap = new Map<string, number>();
  dbRates.forEach((r: { voucherType: string; buyRate: number }) =>
    rateMap.set(r.voucherType.toLowerCase(), r.buyRate),
  );

  // Helper to get rate string
  const getRateDisplay = (voucherId: string, defaultRateStr: string) => {
    // Direct lookup by voucherId (seeded in API)
    const rate = rateMap.get(voucherId);
    if (rate !== undefined) {
      return `${(rate * 100).toFixed(0)}%`;
    }
    return defaultRateStr;
  };

  // Helper to get fee string
  const getFeeDisplay = (voucherId: string, defaultFeeStr: string) => {
    const rate = rateMap.get(voucherId);
    if (rate !== undefined) {
      return `${((1 - rate) * 100).toFixed(0)}%`;
    }
    return defaultFeeStr;
  };

  // Enhance Vouchers with DB Data
  const enhancedVouchers = VOUCHERS.map((v) => ({
    ...v,
    purchaseRate: getRateDisplay(v.id, v.purchaseRate),
    fee: getFeeDisplay(v.id, v.fee),
  }));

  const onlineVouchers = enhancedVouchers.filter(
    (v) => v.category === "online",
  );
  const mobileVouchers = enhancedVouchers.filter(
    (v) => v.category === "mobile",
  );
  const deptVouchers = enhancedVouchers.filter(
    (v) => v.category === "department",
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="w-full">
        {/* Header Section */}
        <SubPageHero
          title="매입 시세표"
          description={
            <>
              실시간 매입 시세를 확인하세요. <br className="hidden sm:block" />
              <span className="text-emerald-400 font-bold">
                천만원 이상 대량 판매
              </span>{" "}
              시 특별 우대 혜택을 드립니다.
            </>
          }
          badgeText="Realtime Rates"
          category="Rates"
        />

        <div className="space-y-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
          <RateSection
            title="온라인 상품권"
            vouchers={onlineVouchers}
            index="01"
          />
          <RateSection
            title="모바일 교환권"
            vouchers={mobileVouchers}
            index="02"
          />
          <RateSection
            title="백화점 상품권"
            vouchers={deptVouchers}
            index="03"
          />
        </div>

        {/* Notice Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-sky-500 rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between shadow-lg text-white">
          <div className="flex gap-5">
            <div className="bg-white/20 p-3 rounded-2xl shrink-0 backdrop-blur-sm">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-xl mb-1">대량 판매 특별 우대</h4>
              <p className="text-indigo-100 font-medium leading-relaxed">
                사업자/법인 대량 판매 시 전담 매니저가 배치되어{" "}
                <br className="hidden md:block" />
                특별 우대율로 매입을 도와드립니다.
              </p>
            </div>
          </div>
          <button className="whitespace-nowrap px-8 py-3.5 bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-2xl transition-colors shadow-lg">
            VIP 상담하기
          </button>
        </div>
      </div>
    </div>
  );
}

const RateSection = ({
  title,
  vouchers,
  index,
}: {
  title: string;
  vouchers: typeof VOUCHERS;
  index: string;
}) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 border-b pb-4 border-slate-100">
      <span className="text-2xl font-black text-indigo-200">{index}</span>
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vouchers.map((v) => (
        <div
          key={v.id}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group relative overflow-hidden"
        >
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="w-16 h-16 relative">
              <Image
                src={v.imagePath || "/images/icons/culture.png"}
                alt={v.name}
                fill
                className="object-contain drop-shadow-md"
              />
            </div>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                v.status === "매입중"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {v.status}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-800 mb-1 relative z-10">
            {v.name}
          </h3>

          <div className="flex items-baseline gap-2 mb-4 relative z-10">
            <span className="text-3xl font-extrabold text-indigo-600 tracking-tight">
              {v.purchaseRate}
            </span>
            <span className="text-sm text-slate-400 font-medium">
              수수료 {v.fee}
            </span>
          </div>

          <Link
            href={`/purchase?voucher=${v.id}`}
            className="w-full py-3 bg-slate-50 border border-slate-200 text-slate-600 font-bold rounded-xl group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent transition-all flex items-center justify-center gap-2 relative z-10"
          >
            판매신청
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* Background Blob for aesthetics */}
          <div
            className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-700 ${v.color.split(" ")[1] || "bg-indigo-500"}`}
          />
        </div>
      ))}
    </div>
  </div>
);
