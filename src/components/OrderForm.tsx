"use client";

import { usePurchase } from "@/context/PurchaseContext";
import { useDialog } from "@/context/DialogContext";
import { Plus, Minus, AlertCircle, Loader2 } from "lucide-react";
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
    // ... validation logic remains same ...
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
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 md:p-8 flex flex-col gap-8 relative overflow-hidden ring-1 ring-white/50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none" />

        {/* 1. Selected Voucher Info */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200/60 relative z-10">
          {selectedVoucher ? (
            <>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedVoucher.color} shadow-sm`}
              >
                <selectedVoucher.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  {selectedVoucher.name}
                </h3>
                <p className="text-sm text-indigo-600 font-bold">
                  매입가 {selectedVoucher.purchaseRate} (수수료{" "}
                  {selectedVoucher.fee})
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-slate-400">
              <AlertCircle />
              <span>왼쪽에서 상품권을 선택해주세요.</span>
            </div>
          )}
        </div>

        {/* 2. PIN Input Section */}
        <div className="space-y-4 relative z-10">
          <label className="text-sm font-bold text-slate-700 flex justify-between">
            <span>핀번호 입력</span>
            <span className="text-xs text-slate-400 font-normal">
              여러 장 한번에 판매 가능
            </span>
          </label>

          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {pinCodes.map((code, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => updatePin(idx, e.target.value)}
                  placeholder={
                    selectedVoucher
                      ? `${selectedVoucher.name} 핀번호 입력`
                      : "상품권을 선택해주세요"
                  }
                  className="flex-1 bg-white/60 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono hover:bg-white"
                  disabled={!selectedVoucher}
                  title="상품권 핀번호"
                />
                {pinCodes.length > 1 && (
                  <button
                    onClick={() => removePin(idx)}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="핀번호 삭제"
                  >
                    <Minus size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addPin}
            className="w-full py-3 border border-dashed border-indigo-200 bg-white/50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-white hover:border-indigo-300 transition-colors flex items-center justify-center gap-2"
            title="핀번호 추가"
          >
            <Plus size={16} /> 핀번호 추가하기
          </button>
        </div>

        {/* 3. Bank Account Info */}
        <div className="space-y-4 relative z-10">
          <h2 className="text-sm font-bold text-slate-700">입금 계좌 정보</h2>

          <div className="grid grid-cols-3 gap-2">
            <select
              className="col-span-1 bg-white/60 border border-slate-200 rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-white"
              value={bankInfo.bankName}
              onChange={(e) => updateBankInfo({ bankName: e.target.value })}
              title="은행 선택"
            >
              <option value="">은행 선택</option>
              <option value="KB국민">KB국민</option>
              <option value="신한">신한</option>
              <option value="우리">우리</option>
              <option value="하나">하나</option>
              <option value="NH농협">NH농협</option>
              <option value="카카오뱅크">카카오뱅크</option>
              <option value="토스뱅크">토스뱅크</option>
            </select>
            <input
              type="text"
              placeholder="계좌번호 (- 없이)"
              className="col-span-2 bg-white/60 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-white"
              value={bankInfo.accountNumber}
              onChange={(e) =>
                updateBankInfo({ accountNumber: e.target.value })
              }
              title="계좌번호"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="예금주명"
              className="bg-white/60 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-white"
              value={bankInfo.accountHolder}
              onChange={(e) =>
                updateBankInfo({ accountHolder: e.target.value })
              }
              title="예금주명"
            />
            <input
              type="text"
              placeholder="휴대폰 번호"
              className="bg-white/60 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-white"
              value={bankInfo.phoneNumber}
              onChange={(e) => updateBankInfo({ phoneNumber: e.target.value })}
              title="휴대폰 번호"
            />
          </div>
        </div>

        {/* 4. Privacy & Submit */}
        <div className="mt-2 space-y-4 relative z-10">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                className="rounded text-indigo-600 focus:ring-indigo-500"
                defaultChecked
                title="개인정보 수집 동의"
              />
              <span>개인정보 수집 및 이용에 동의합니다.</span>
            </label>
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-xs text-slate-400 underline hover:text-indigo-500"
            >
              내용보기
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !selectedVoucher}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02]"
          >
            {loading ? <Loader2 className="animate-spin" /> : "판매 신청하기"}
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
