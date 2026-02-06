"use client";

import { useState } from "react";
import { Copy, Check, Eye, X } from "lucide-react";
import { useDialog } from "@/context/DialogContext";

interface Transaction {
  id: string;
  user?: {
    name: string;
    phoneNumber: string;
  };
  accountHolder: string | null;
  voucherType: string;
  totalFaceValue: number;
  payoutAmount: number;
  status: string;
  createdAt: string | Date;
  pinCodes: string[]; // Json type
  bankName?: string;
  accountNumber?: string;
  items?: any[]; // TransactionItem relation
}

export function TransactionTable({
  initialTransactions,
}: {
  initialTransactions: Transaction[];
}) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const { openDialog } = useDialog();

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/transactions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setTransactions((prev) =>
          prev.map((tx) => (tx.id === id ? { ...tx, status: newStatus } : tx)),
        );
        openDialog({ message: "상태가 변경되었습니다." });
        if (selectedTx?.id === id) {
          setSelectedTx((prev) =>
            prev ? { ...prev, status: newStatus } : null,
          );
        }
      } else {
        throw new Error("Update failed");
      }
    } catch {
      openDialog({ message: "상태 변경 실패", type: "alert" });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast here
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">
              Total: {transactions.length}
            </span>
            <span className="text-slate-400 text-sm">실시간 거래 현황</span>
          </div>
          {/* Simple Filter Placeholder (Functional implementation later) */}
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
              전체보기
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:border-indigo-200 hover:text-indigo-600 transition-colors">
              대기중만 보기
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 backdrop-blur-sm text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">거래 ID</th>
                <th className="px-6 py-5 whitespace-nowrap">사용자 정보</th>
                <th className="px-6 py-5 whitespace-nowrap">상품권 종류</th>
                <th className="px-6 py-5 text-right whitespace-nowrap">
                  지급 금액
                </th>
                <th className="px-6 py-5 text-center whitespace-nowrap">
                  진행 상태
                </th>
                <th className="px-6 py-5 text-center whitespace-nowrap">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                  onClick={() => setSelectedTx(tx)}
                >
                  <td className="px-6 py-5 font-mono text-xs text-slate-400 group-hover:text-indigo-400 transition-colors">
                    #{tx.id.substring(0, 8)}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                        {(tx.accountHolder || tx.user?.name || "?")[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">
                          {tx.accountHolder || tx.user?.name || "알 수 없음"}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">
                          {tx.user?.phoneNumber || "-"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      {tx.voucherType}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="font-black text-slate-900 text-base">
                      {tx.payoutAmount.toLocaleString()}
                      <span className="text-xs font-normal text-slate-400 ml-0.5">
                        원
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium bg-slate-50 inline-block px-1.5 py-0.5 rounded mt-1">
                      액면: {tx.totalFaceValue.toLocaleString()}원
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <StatusBadge status={tx.status} />
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTx(tx);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
                      title="상세보기"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-20 text-center text-slate-400 bg-slate-50/50"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                        <X className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="font-bold text-slate-500">
                        거래 내역이 없습니다.
                      </p>
                      <p className="text-xs">
                        새로운 거래가 접수되면 이곳에 표시됩니다.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-900">
                거래 상세 정보
              </h3>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-2 hover:bg-slate-100 rounded-full"
                aria-label="닫기"
                title="닫기"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Account Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <label className="text-xs text-slate-500 font-bold mb-1 block">
                    입금 계좌
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-800">
                      {selectedTx.bankName} {selectedTx.accountNumber}
                    </span>
                    <Copy
                      className="w-4 h-4 text-slate-400 cursor-pointer hover:text-indigo-600"
                      onClick={() =>
                        copyToClipboard(
                          `${selectedTx.bankName} ${selectedTx.accountNumber}`,
                        )
                      }
                    />
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    {selectedTx.accountHolder}
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <label className="text-xs text-slate-500 font-bold mb-1 block">
                    입금할 금액
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-indigo-600">
                      {selectedTx.payoutAmount.toLocaleString()}원
                    </span>
                    <Copy
                      className="w-4 h-4 text-slate-400 cursor-pointer hover:text-indigo-600"
                      onClick={() =>
                        copyToClipboard(selectedTx.payoutAmount.toString())
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              <div className="space-y-3">
                <label className="text-xs text-slate-500 font-bold block">
                  상태 변경
                </label>
                <div className="flex gap-2">
                  {["PENDING", "VERIFYING"].includes(selectedTx.status) && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(selectedTx.id, "VERIFIED")
                      }
                      className="flex-1 bg-blue-100 text-blue-700 py-3 rounded-xl font-bold hover:bg-blue-200 transition-colors"
                    >
                      검증 완료 (VERIFIED)
                    </button>
                  )}
                  {["VERIFIED", "TRANSFER_PENDING"].includes(
                    selectedTx.status,
                  ) && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(selectedTx.id, "COMPLETED")
                      }
                      className="flex-1 bg-emerald-100 text-emerald-700 py-3 rounded-xl font-bold hover:bg-emerald-200 transition-colors"
                    >
                      이체 완료 (COMPLETE)
                    </button>
                  )}
                  {!["COMPLETED", "FAILED", "CANCELLED"].includes(
                    selectedTx.status,
                  ) && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(selectedTx.id, "FAILED")
                      }
                      className="px-6 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors"
                    >
                      거절 / 실패
                    </button>
                  )}
                </div>
              </div>

              {/* Transaction Items Detail */}
              <div>
                <label className="text-xs text-slate-500 font-bold mb-3 block">
                  상품권 상세 내역
                </label>
                <div className="space-y-2">
                  {selectedTx.items && selectedTx.items.length > 0
                    ? selectedTx.items.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex flex-col p-3 border border-slate-200 rounded-lg gap-2 bg-slate-50/50"
                        >
                          <div className="flex justify-between items-center">
                            <code className="font-mono text-slate-700 font-bold text-base">
                              {item.pinCode}
                            </code>
                            <StatusBadge status={item.status} />
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500">
                              액면:{" "}
                              <span className="font-bold">
                                {item.faceValue?.toLocaleString()}원
                              </span>
                            </span>
                            <span className="text-slate-500">
                              매입:{" "}
                              <span className="font-bold text-indigo-600">
                                {item.payoutAmount?.toLocaleString()}원
                              </span>
                            </span>
                          </div>
                          {item.errorMessage && (
                            <div className="text-[10px] text-rose-500 bg-rose-50 px-2 py-1 rounded">
                              {item.errorMessage}
                            </div>
                          )}
                        </div>
                      ))
                    : // Fallback for old data without items
                      Array.isArray(selectedTx.pinCodes) &&
                      selectedTx.pinCodes.map((pin: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-3 border border-slate-200 rounded-lg"
                        >
                          <code className="font-mono text-slate-700 font-bold text-lg">
                            {pin}
                          </code>
                          <span className="text-xs text-slate-400">
                            상세 정보 없음
                          </span>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    VERIFYING: "bg-blue-50 text-blue-600 border-blue-100",
    VERIFIED: "bg-indigo-50 text-indigo-600 border-indigo-100",
    TRANSFER_PENDING: "bg-purple-50 text-purple-600 border-purple-100",
    COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    FAILED: "bg-rose-50 text-rose-600 border-rose-100",
    CANCELLED: "bg-slate-100 text-slate-500 border-slate-200",
    MANUAL_REVIEW:
      "bg-orange-50 text-orange-600 border-orange-100 animate-pulse",
  };

  const dotColors: Record<string, string> = {
    PENDING: "bg-amber-500",
    VERIFYING: "bg-blue-500",
    VERIFIED: "bg-indigo-500",
    TRANSFER_PENDING: "bg-purple-500",
    COMPLETED: "bg-emerald-500",
    FAILED: "bg-rose-500",
    CANCELLED: "bg-slate-400",
    MANUAL_REVIEW: "bg-orange-500",
  };

  const labels: Record<string, string> = {
    PENDING: "접수 대기",
    VERIFYING: "검증 진행",
    VERIFIED: "검증 완료",
    TRANSFER_PENDING: "이체 대기",
    COMPLETED: "거래 완료",
    FAILED: "거절/실패",
    CANCELLED: "취소됨",
    MANUAL_REVIEW: "확인 필요",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border shadow-sm ${styles[status] || styles.PENDING}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dotColors[status] || "bg-slate-400"}`}
      />
      {labels[status] || status}
    </span>
  );
}
