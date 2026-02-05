"use client";

import { useState } from "react";
import { Search, X, Loader2, Calendar, CheckSquare, Square } from "lucide-react";
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
