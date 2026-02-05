"use client";

import { useState } from "react";
import {
  Search,
  X,
  Loader2,
  Calendar,
  CheckSquare,
  Square,
} from "lucide-react";
import { PrivacyPolicyModal } from "./PrivacyPolicyModal";

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderResult {
  id: string;
  voucherType: string;
  totalFaceValue: number;
  payoutAmount: number;
  status: string;
  createdAt: string;
}

export function OrderLookupModal({ isOpen, onClose }: OrderLookupModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<OrderResult[]>([]);
  const [error, setError] = useState("");

  const [agreed, setAgreed] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      setError("이름과 휴대폰 번호를 모두 입력해주세요.");
      return;
    }

    if (!agreed) {
      setError("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const queryParams = new URLSearchParams({
        name,
        phone,
      });

      const res = await fetch(`/api/orders/lookup?${queryParams}`);
      const data = await res.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.message || "조회 중 오류가 발생했습니다.");
      }
    } catch (_err) {
      setError("서버와의 통신에 실패했습니다.");
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  const statusMap: Record<string, { label: string; className: string }> = {
    PENDING: { label: "접수대기", className: "bg-amber-100 text-amber-700" },
    VERIFYING: { label: "검증중", className: "bg-blue-100 text-blue-700" },
    VERIFIED: { label: "검증완료", className: "bg-indigo-100 text-indigo-700" },
    TRANSFER_PENDING: {
      label: "이체대기",
      className: "bg-purple-100 text-purple-700",
    },
    COMPLETED: {
      label: "지급완료",
      className: "bg-emerald-100 text-emerald-700",
    },
    FAILED: { label: "거절/실패", className: "bg-rose-100 text-rose-700" },
    CANCELLED: { label: "취소됨", className: "bg-slate-100 text-slate-600" },
    MANUAL_REVIEW: {
      label: "확인필요",
      className: "bg-orange-100 text-orange-700",
    },
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div
          className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 pb-6 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Search className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              내 주문 조회
            </h2>
            <p className="text-slate-500 whitespace-pre-line leading-relaxed text-sm">
              고객님의 성함과 휴대폰 번호를
              <br />
              입력해주세요.
            </p>
          </div>

          <div className="px-8 pb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl font-bold flex items-center justify-center animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">
                  고객명
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="고객명(예금주)을 입력해주세요."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 ml-1">
                  휴대폰 번호
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/[^0-9-]/g, ""))
                  }
                  placeholder="010-0000-0000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>

              {/* Privacy Policy Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAgreed(!agreed)}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  {agreed ? (
                    <CheckSquare className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300" />
                  )}
                  <span className="font-bold">개인정보 수집에 동의합니다.</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="text-xs text-slate-400 underline hover:text-indigo-500"
                >
                  내용보기
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !agreed}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    조회중...
                  </>
                ) : (
                  "주문 내역 조회하기"
                )}
              </button>
            </form>

            {/* Search Results Area */}
            {hasSearched && !loading && (
              <div className="mt-8 border-t border-slate-100 pt-6 animate-in slide-in-from-bottom-2">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  최근 1년 주문 내역
                </h3>

                {results.length > 0 ? (
                  <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                    {results.map((order) => {
                      const status = statusMap[order.status] || {
                        label: order.status,
                        className: "bg-slate-100 text-slate-600",
                      };
                      return (
                        <div
                          key={order.id}
                          className="bg-white border border-slate-100 rounded-xl p-4 flex justify-between items-center hover:border-indigo-200 transition-colors shadow-sm"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-slate-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                                {order.voucherType}
                              </span>
                            </div>
                            <div className="text-sm font-medium text-slate-700">
                              {order.totalFaceValue.toLocaleString()}원
                            </div>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-block text-[10px] font-bold px-2 py-1 rounded-full mb-1 ${status.className}`}
                            >
                              {status.label}
                            </span>
                            <div className="text-sm font-bold text-indigo-600">
                              {order.payoutAmount.toLocaleString()}원
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                    <p className="text-slate-500 text-sm font-medium">
                      검색된 주문 내역이 없습니다.
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      입력 정보를 다시 확인해주세요.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!hasSearched && (
              <p className="text-center text-slate-400 text-xs mt-6">
                최근 1년 이내에 신청하신 주문만 조회됩니다.
              </p>
            )}
          </div>
        </div>

        <PrivacyPolicyModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
        />
      </div>
    </>
  );
}
