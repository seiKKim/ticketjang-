"use client";

import { usePurchase } from "@/context/PurchaseContext";
import { useDialog } from "@/context/DialogContext";
import {
  Plus,
  Minus,
  AlertCircle,
  Loader2,
  User,
  Smartphone,
  CreditCard,
  Building,
} from "lucide-react";
import { useState } from "react";

import { PrivacyPolicyModal } from "./PrivacyPolicyModal";

export function OrderForm() {
  const {
    selectedVoucher,
    pinCodes,
    bankInfo,
    updateBankInfo,
    addPin,
    removePin,
    updatePin,
    setPinCodes,
  } = usePurchase();

  const { openDialog } = useDialog();
  const [loading, setLoading] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleSubmit = async () => {
    // Basic Validation
    if (!selectedVoucher) {
      return openDialog({ message: "상품권을 먼저 선택해주세요." });
    }
    const validPins = pinCodes.filter((p) => p.trim().length > 0);
    if (validPins.length === 0) {
      return openDialog({ message: "최소 1개 이상의 핀번호를 입력해주세요." });
    }
    if (
      !bankInfo.bankName ||
      !bankInfo.accountNumber ||
      !bankInfo.accountHolder ||
      !bankInfo.phoneNumber
    ) {
      return openDialog({ message: "계좌정보와 연락처를 모두 입력해주세요." });
    }

    setLoading(true);
    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voucherType:
            selectedVoucher.validatorCode || selectedVoucher.id.toUpperCase(),
          pinCodes: validPins,
          userName: bankInfo.accountHolder,
          bankName: bankInfo.bankName,
          accountNumber: bankInfo.accountNumber,
          phoneNumber: bankInfo.phoneNumber,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const totalPayout = data.data?.totalPayout || 0;
        openDialog({
          title: "신청 완료",
          message: `총 ${validPins.length}건의 상품권 매입 신청이 접수되었습니다.\n(예상 매입금액: ${totalPayout.toLocaleString()}원)\n\n담당자 확인 후 5분 내 입금됩니다.`,
          type: "alert",
        });
        setPinCodes([""]);
      } else {
        openDialog({
          title: "신청 실패",
          message: data.message || "매입 신청 중 오류가 발생했습니다.",
          type: "alert",
        });
      }
    } catch (e) {
      console.error(e);
      openDialog({ message: "서버 통신 오류가 발생했습니다." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-100/50 border border-white/50 p-6 md:p-8 flex flex-col gap-8 relative overflow-hidden">
        {/* Soft Background Gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none" />

        {/* 1. Selected Voucher Info */}
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100 relative z-10">
          {selectedVoucher ? (
            <>
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selectedVoucher.color} shadow-sm shadow-indigo-200/50 ring-4 ring-white`}
              >
                <selectedVoucher.icon className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md mb-1 inline-block">
                  선택된 상품권
                </span>
                <h3 className="font-black text-slate-800 text-xl tracking-tight">
                  {selectedVoucher.name}
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-0.5">
                  매입가{" "}
                  <span className="text-indigo-600 font-bold">
                    {selectedVoucher.purchaseRate}
                  </span>
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 text-slate-400 bg-slate-50 p-4 rounded-2xl w-full border border-dashed border-slate-200">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                상품권을 선택하면 정보가 표시됩니다.
              </span>
            </div>
          )}
        </div>

        {/* 2. PIN Input Section */}
        <div className="space-y-4 relative z-10">
          <label className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <div className="w-1 h-4 bg-indigo-500 rounded-full" />
              핀번호 입력
            </span>
            <span className="text-[11px] text-indigo-500 font-bold bg-indigo-50 px-2 py-1 rounded-full">
              여러 장 추가 가능
            </span>
          </label>

          <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
            {pinCodes.map((code, idx) => (
              <div key={idx} className="flex gap-2 group">
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <span className="text-xs font-bold">PIN</span>
                  </div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => updatePin(idx, e.target.value)}
                    placeholder={
                      selectedVoucher
                        ? `${selectedVoucher.name} 핀번호 입력`
                        : "상품권 선택 대기..."
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono font-medium hover:bg-white focus:bg-white"
                    disabled={!selectedVoucher}
                  />
                </div>
                {pinCodes.length > 1 && (
                  <button
                    onClick={() => removePin(idx)}
                    className="w-11 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all"
                    title="삭제"
                  >
                    <Minus size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addPin}
            className="w-full py-3.5 border border-dashed border-indigo-200 bg-indigo-50/50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center gap-2 group"
          >
            <div className="bg-white p-1 rounded-full shadow-sm group-hover:scale-110 transition-transform">
              <Plus size={14} />
            </div>
            핀번호 추가하기
          </button>
        </div>

        {/* 3. Bank Account Info */}
        <div className="space-y-4 relative z-10">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <div className="w-1 h-4 bg-emerald-500 rounded-full" />
            입금 계좌 정보
          </label>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="relative col-span-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Building size={16} />
                </div>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-3.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white appearance-none transition-all cursor-pointer"
                  value={bankInfo.bankName}
                  onChange={(e) => updateBankInfo({ bankName: e.target.value })}
                  title="은행 선택"
                >
                  <option value="">은행</option>
                  <option value="KB국민">KB국민</option>
                  <option value="신한">신한</option>
                  <option value="우리">우리</option>
                  <option value="하나">하나</option>
                  <option value="NH농협">NH농협</option>
                  <option value="카카오뱅크">카카오뱅크</option>
                  <option value="토스뱅크">토스뱅크</option>
                </select>
              </div>

              <div className="relative col-span-2">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <CreditCard size={16} />
                </div>
                <input
                  type="text"
                  placeholder="계좌번호 (- 없이)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white transition-all font-medium"
                  value={bankInfo.accountNumber}
                  onChange={(e) =>
                    updateBankInfo({ accountNumber: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  placeholder="예금주명"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white transition-all font-medium"
                  value={bankInfo.accountHolder}
                  onChange={(e) =>
                    updateBankInfo({ accountHolder: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Smartphone size={16} />
                </div>
                <input
                  type="text"
                  placeholder="휴대폰 번호"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white transition-all font-medium"
                  value={bankInfo.phoneNumber}
                  onChange={(e) =>
                    updateBankInfo({ phoneNumber: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Privacy & Submit */}
        <div className="pt-2 space-y-4 relative z-10 border-t border-slate-100 mt-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-all"
                  defaultChecked
                  title="개인정보 수집 동의"
                />
              </div>
              <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">
                개인정보 수집 및 이용 동의
              </span>
            </label>
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-[11px] font-bold text-slate-400 hover:text-indigo-500 bg-slate-50 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
            >
              내용보기
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !selectedVoucher}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] text-lg disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <span>판매 신청하기</span>
                {/* <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" /> */}
              </>
            )}
          </button>
        </div>
      </div>

      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </>
  );
}
