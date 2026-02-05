import { prisma } from "@/lib/prisma";
import { TransactionTable } from "@/components/admin/TransactionTable";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            거래 관리
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            전체{" "}
            <span className="text-indigo-600 font-bold">
              {transactions.length}건
            </span>
            의 거래 내역을 조회합니다.
          </p>
        </div>
        <div className="flex gap-2">
          {/* Additional Actions (Export, etc.) can go here */}
        </div>
      </div>

      <TransactionTable
        initialTransactions={JSON.parse(JSON.stringify(transactions))}
      />
    </div>
  );
}
