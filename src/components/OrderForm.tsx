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
  ChevronRight,
  Search,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { SegmentedPinInput } from "./inputs/SegmentedPinInput";
import { PrivacyPolicyModal } from "./PrivacyPolicyModal";

// --- Bank Data with Categories ---
const BANK_DATA = [
  // Major & Internet (Bank)
  { name: "카카오뱅크", code: "kakao", type: "bank" },
  { name: "KB국민", code: "kb", type: "bank" },
  { name: "신한", code: "shinhan", type: "bank" },
  { name: "우리", code: "woori", type: "bank" },
  { name: "하나", code: "hana", type: "bank" },
  { name: "NH농협", code: "nh", type: "bank" },
  { name: "IBK기업", code: "ibk", type: "bank" },
  { name: "토스뱅크", code: "toss", type: "bank" },
  { name: "케이뱅크", code: "kbank", type: "bank" },
  { name: "SC제일", code: "sc", type: "bank" },
  { name: "한국씨티", code: "citi", type: "bank" },
  { name: "KDB산업", code: "kdb", type: "bank" },

  // Local (Bank)
  { name: "iM뱅크(대구)", code: "daegu", type: "bank" },
  { name: "부산", code: "busan", type: "bank" },
  { name: "경남", code: "kyongnam", type: "bank" },
  { name: "광주", code: "gwangju", type: "bank" },
  { name: "전북", code: "jeonbuk", type: "bank" },
  { name: "제주", code: "jeju", type: "bank" },

  // Others (Bank)
  { name: "우체국", code: "post", type: "bank" },
  { name: "새마을금고", code: "kfcc", type: "bank" },
  { name: "신협", code: "cu", type: "bank" },
  { name: "수협", code: "suhyup", type: "bank" },
  { name: "저축은행", code: "sb", type: "bank" },
  { name: "산림조합", code: "sj", type: "bank" },

  // Securities
  { name: "키움증권", code: "kiwoom", type: "security" },
  { name: "미래에셋", code: "mirae", type: "security" },
  { name: "삼성증권", code: "samsung", type: "security" },
  { name: "한국투자", code: "koreainv", type: "security" },
  { name: "NH투자", code: "nhinv", type: "security" },
  { name: "KB증권", code: "kbinv", type: "security" },
  { name: "카카오페이", code: "kakaopay", type: "security" },
  { name: "토스증권", code: "tosssec", type: "security" },
  { name: "신한투자", code: "shinhaninv", type: "security" },
  { name: "하나증권", code: "hanainv", type: "security" },
  { name: "현대차", code: "hyundai", type: "security" },
  { name: "대신증권", code: "daishin", type: "security" },
  { name: "메리츠", code: "meritz", type: "security" },
  { name: "유안타", code: "yuanta", type: "security" },
  { name: "유진투자", code: "eugene", type: "security" },
  { name: "한화투자", code: "hanwha", type: "security" },
  { name: "DB금융", code: "db", type: "security" },
  { name: "교보증권", code: "kyobo", type: "security" },
  { name: "부국증권", code: "bookook", type: "security" },
  { name: "신영증권", code: "shinyoung", type: "security" },
  { name: "SK증권", code: "sk", type: "security" },
  { name: "케이프", code: "cape", type: "security" },
  { name: "BNK투자", code: "bnkinv", type: "security" },
  { name: "IBK투자", code: "ibkinv", type: "security" },

  // Foreign (Bank) - Put at end of bank list logic or separate
  { name: "도이치", code: "deutsche", type: "bank" },
  { name: "중국공상", code: "icbc", type: "bank" },
  { name: "중국", code: "boc", type: "bank" },
  { name: "HSBC", code: "hsbc", type: "bank" },
  { name: "JP모간", code: "jpmorgan", type: "bank" },
];

interface PurchaseResultItem {
  pin: string;
  success: boolean;
  message: string;
  faceValue?: number;
  payout?: number;
}

export function OrderForm() {
  const {
    selectedVoucher,
    pinItems,
    bankInfo,
    updateBankInfo,
    addPin,
    removePin,
    updatePinCode,
    updatePinStatus,
    setPinItems,
  } = usePurchase();

  const { openDialog } = useDialog();
  const [loading, setLoading] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // UI State
  const [isBankSelectorOpen, setIsBankSelectorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [saveBankInfo, setSaveBankInfo] = useState(false);
  const [activeTab, setActiveTab] = useState<"bank" | "security">("bank");

  // Verification State
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [verifyingAccount, setVerifyingAccount] = useState(false);

  // Load saved info on mount
  useEffect(() => {
    const saved = localStorage.getItem("ticketjang_bank_info");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        updateBankInfo(parsed);
        setSaveBankInfo(true);
      } catch (e) {
        console.error("Failed to load saved bank info", e);
      }
    }
  }, []);

  const filteredBanks = useMemo(() => {
    return BANK_DATA.filter((b) => {
      const matchType = b.type === activeTab;
      const matchSearch = b.name.includes(searchTerm);
      return matchType && matchSearch;
    });
  }, [searchTerm, activeTab]);

  const handleBankSelect = (bankName: string) => {
    updateBankInfo({ bankName });
    setIsBankSelectorOpen(false);
    setIsAccountVerified(false); // Reset verification on bank change
  };

  const handleResetBank = () => {
    updateBankInfo({ bankName: "" });
    setIsAccountVerified(false);
  };

  // Verify PIN Function
  const handleVerifyPin = async (index: number) => {
    const item = pinItems[index];
    if (!selectedVoucher || !item.code.trim()) return;

    updatePinStatus(index, { status: "loading", message: "검증 중..." });

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voucherType:
            selectedVoucher.validatorCode || selectedVoucher.id.toUpperCase(),
          pinCode: item.code,
        }),
      });

      const data = await res.json();

      if (data.isValid) {
        updatePinStatus(index, {
          status: "success",
          isVerified: true,
          message: data.message || "사용 가능",
          faceValue: data.faceValue,
        });
      } else {
        updatePinStatus(index, {
          status: "error",
          isVerified: false,
          message: data.message || "유효하지 않음",
        });
      }
    } catch (e) {
      updatePinStatus(index, {
        status: "error",
        isVerified: false,
        message: "검증 오류",
      });
    }
  };

  // Account Verification Function
  const handleVerifyAccount = async () => {
    if (!bankInfo.bankName || !bankInfo.accountNumber) {
      return openDialog({ message: "은행과 계좌번호를 먼저 입력해주세요." });
    }

    setVerifyingAccount(true);
    try {
      const res = await fetch("/api/verify-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankCode:
            BANK_DATA.find((b) => b.name === bankInfo.bankName)?.code || "",
          accountNumber: bankInfo.accountNumber,
        }),
      });
      const data = await res.json();

      if (data.success) {
        updateBankInfo({ accountHolder: data.verifiedName });
        setIsAccountVerified(true);
        openDialog({
          type: "alert",
          title: "본인인증 성공",
          message: `예금주 [${data.verifiedName}]님이 확인되었습니다.`,
        });
      } else {
        setIsAccountVerified(false);
        openDialog({ message: data.message || "예금주 조회에 실패했습니다." });
      }
    } catch (e) {
      openDialog({ message: "서버 통신 오류가 발생했습니다." });
    } finally {
      setVerifyingAccount(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!selectedVoucher) {
      return openDialog({ message: "상품권을 먼저 선택해주세요." });
    }

    const verifiedPins = pinItems.filter(
      (p) => p.isVerified && p.status === "success",
    );

    if (verifiedPins.length === 0) {
      return openDialog({
        message:
          "검증 완료된 핀번호가 없습니다. 핀번호 입력 후 '검증' 버튼을 눌러주세요.",
      });
    }

    if (
      !bankInfo.bankName ||
      !bankInfo.accountNumber ||
      !bankInfo.accountHolder ||
      !bankInfo.phoneNumber
    ) {
      return openDialog({ message: "계좌정보와 연락처를 모두 입력해주세요." });
    }

    // Account Verification Check
    if (!isAccountVerified) {
      return openDialog({ message: "계좌 예금주 조회를 진행해주세요." });
    }

    // Save Bank Info if checked
    if (saveBankInfo) {
      localStorage.setItem("ticketjang_bank_info", JSON.stringify(bankInfo));
    } else {
      localStorage.removeItem("ticketjang_bank_info");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voucherType:
            selectedVoucher.validatorCode || selectedVoucher.id.toUpperCase(),
          pinCodes: verifiedPins.map((p) => p.code),
          userName: bankInfo.accountHolder,
          bankName: bankInfo.bankName,
          accountNumber: bankInfo.accountNumber,
          phoneNumber: bankInfo.phoneNumber,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Success Logic
        const results = data.data?.results || [];
        const successCount = results.filter(
          (r: PurchaseResultItem) => r.success,
        ).length;
        const totalPayout = data.data?.totalPayout || 0;

        openDialog({
          title: "신청 완료",
          message: `총 ${successCount}건 매입 신청 성공!\n입금 예정 금액: ${totalPayout.toLocaleString()}원\n(담당자 확인 후 5분 내 입금됩니다)`,
          type: "alert",
        });

        // Reset valid pins
        setPinItems([{ code: "", status: "idle", isVerified: false }]);
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
              핀번호 입력 및 검증
            </span>
            <span className="text-[11px] text-indigo-500 font-bold bg-indigo-50 px-2 py-1 rounded-full">
              모든 핀 검증 필수
            </span>
          </label>
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {pinItems.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2 group">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-start">
                    <div className="relative flex-1">
                      {selectedVoucher?.pinSegments ? (
                        <SegmentedPinInput
                          value={item.code}
                          onChange={(val) => updatePinCode(idx, val)}
                          segments={selectedVoucher.pinSegments}
                          disabled={
                            !selectedVoucher ||
                            item.status === "loading" ||
                            item.status === "success"
                          }
                          status={item.status}
                          placeholder="4자리"
                          className="w-full"
                        />
                      ) : (
                        <input
                          type="text"
                          value={item.code}
                          onChange={(e) => updatePinCode(idx, e.target.value)}
                          placeholder={
                            selectedVoucher
                              ? `${selectedVoucher.name} 핀번호 입력`
                              : "상품권 선택 대기..."
                          }
                          className="w-full bg-slate-50 border rounded-xl pl-12 pr-4 py-3.5 text-sm outline-none transition-all font-mono font-medium hover:bg-white focus:bg-white"
                          disabled={
                            !selectedVoucher ||
                            item.status === "loading" ||
                            item.status === "success"
                          }
                        />
                      )}
                      {pinItems.length > 1 && (
                        <button
                          onClick={() => removePin(idx)}
                          className="w-11 h-[52px] flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 rounded-xl transition-all shrink-0"
                          title="핀번호 삭제"
                          aria-label="핀번호 삭제"
                        >
                          <Minus size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                  {item.status !== "success" && (
                    <button
                      onClick={() => handleVerifyPin(idx)}
                      disabled={
                        !item.code.trim() ||
                        item.status === "loading" ||
                        !selectedVoucher
                      }
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      검증하기
                    </button>
                  )}
                </div>
                {item.message && (
                  <div
                    className={`text-xs font-medium px-2 ${item.status === "success" ? "text-emerald-600" : "text-rose-600"}`}
                  >
                    {item.message}
                    {item.faceValue && item.status === "success" && (
                      <span className="font-bold ml-1">
                        ({item.faceValue.toLocaleString()}원)
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addPin}
            className="w-full py-3.5 border border-dashed border-indigo-200 bg-indigo-50/50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 hover:border-indigo-300 transition-all flex items-center justify-center gap-2 group"
          >
            <Plus size={14} />
            핀번호 추가하기
          </button>
        </div>

        {/* 3. Bank Account Info */}
        <div className="space-y-4 relative z-10">
          <label className="flex items-center justify-between text-sm font-bold text-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-emerald-500 rounded-full" />
              입금 계좌 정보
            </div>
            {bankInfo.bankName && (
              <button
                onClick={handleResetBank}
                className="text-xs text-slate-400 hover:text-indigo-500 flex items-center gap-1 font-medium transition-colors"
              >
                <RotateCcw size={12} /> 변경
              </button>
            )}
          </label>

          {!bankInfo.bankName ? (
            <button
              onClick={() => setIsBankSelectorOpen(true)}
              className="w-full py-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between px-6 hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <span className="font-bold text-slate-800 text-base">
                은행 선택
              </span>
              <div className="bg-slate-50 text-slate-400 p-2 rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-lg font-bold text-indigo-600 border border-indigo-50">
                  {bankInfo.bankName[0]}
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-400">
                    선택된 은행
                  </span>
                  <h4 className="font-bold text-indigo-900 text-lg">
                    {bankInfo.bankName}
                  </h4>
                </div>
                <button
                  onClick={() => setIsBankSelectorOpen(true)}
                  className="ml-auto px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  변경
                </button>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <CreditCard size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="계좌번호 (- 없이)"
                    className={`w-full bg-slate-50 border rounded-xl pl-11 pr-4 py-4 text-slate-800 outline-none transition-all font-medium text-base
                      ${isAccountVerified ? "border-emerald-500 ring-1 ring-emerald-500/20" : "border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white"}
                    `}
                    value={bankInfo.accountNumber}
                    onChange={(e) => {
                      updateBankInfo({
                        accountNumber: e.target.value.replace(/[^0-9]/g, ""),
                      });
                      setIsAccountVerified(false);
                    }}
                  />
                  {isAccountVerified && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 flex items-center gap-1 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                      <CheckCircle2 size={12} /> 인증됨
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="예금주명"
                      className={`w-full bg-slate-50 border rounded-xl pl-11 pr-4 py-4 text-slate-800 outline-none font-medium text-base
                        ${isAccountVerified ? "border-emerald-500 text-emerald-700 bg-emerald-50/10 cursor-not-allowed" : "border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white transition-all"}
                      `}
                      value={bankInfo.accountHolder}
                      readOnly={isAccountVerified}
                      onChange={(e) => {
                        updateBankInfo({ accountHolder: e.target.value });
                        setIsAccountVerified(false);
                      }}
                    />
                  </div>
                  <button
                    onClick={handleVerifyAccount}
                    disabled={
                      verifyingAccount ||
                      isAccountVerified ||
                      !bankInfo.accountNumber.length
                    }
                    className={`px-4 rounded-xl font-bold text-sm whitespace-nowrap transition-all shadow-sm
                      ${
                        isAccountVerified
                          ? "bg-emerald-500 text-white cursor-default"
                          : "bg-slate-800 text-white hover:bg-slate-900 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                      }
                    `}
                  >
                    {verifyingAccount ? (
                      <Loader2 className="animate-spin w-5 h-5" />
                    ) : isAccountVerified ? (
                      "확인됨"
                    ) : (
                      "예금주 조회"
                    )}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Smartphone size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="휴대폰 번호"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-4 text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:bg-white transition-all font-medium text-base"
                    value={bankInfo.phoneNumber}
                    onChange={(e) =>
                      updateBankInfo({ phoneNumber: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer group justify-end">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={saveBankInfo}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setSaveBankInfo(isChecked);
                      if (!isChecked) {
                        localStorage.removeItem("ticketjang_bank_info");
                      }
                    }}
                    className="peer w-4 h-4 rounded border-slate-300 text-pink-500 focus:ring-pink-500 cursor-pointer transition-all"
                  />
                </div>
                <span className="text-sm font-bold text-slate-500 group-hover:text-pink-500 transition-colors">
                  은행정보 기억하기
                </span>
              </label>
            </div>
          )}
        </div>

        {/* --- Payout Calculation Summary --- */}
        {pinItems.some((p) => p.status === "success" && p.isVerified) && (
          <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100 relative z-10 animate-in fade-in zoom-in-95 duration-300">
            <h4 className="text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-indigo-500 rounded-full" />
              매입 예상 금액
            </h4>

            <div className="space-y-3">
              {/* 1. Total Verified Amount */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">
                  총 확인된 상품권 금액
                </span>
                <span className="font-bold text-slate-700">
                  {pinItems
                    .filter((p) => p.status === "success" && p.faceValue)
                    .reduce((acc, curr) => acc + (curr.faceValue || 0), 0)
                    .toLocaleString()}{" "}
                  원
                </span>
              </div>

              {/* 2. Purchase Rate Applied */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">
                  매입 수수료율 (
                  {selectedVoucher ? (
                    <span className="text-indigo-600">
                      {(
                        100 -
                        parseFloat(
                          selectedVoucher.purchaseRate.replace("%", ""),
                        )
                      ).toFixed(0)}
                      %
                    </span>
                  ) : (
                    "0%"
                  )}
                  )
                </span>
                <span className="font-bold text-rose-500">
                  -{" "}
                  {(
                    pinItems
                      .filter((p) => p.status === "success" && p.faceValue)
                      .reduce((acc, curr) => acc + (curr.faceValue || 0), 0) *
                    (selectedVoucher
                      ? (100 -
                          parseFloat(
                            selectedVoucher.purchaseRate.replace("%", ""),
                          )) /
                        100
                      : 0)
                  ).toLocaleString()}{" "}
                  원
                </span>
              </div>

              {/* 3. Transfer Fee */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">
                  이체 수수료 (건당)
                </span>
                <span className="font-bold text-rose-500">- 500 원</span>
              </div>

              <div className="w-full h-px bg-indigo-100 my-2" />

              {/* 4. Final Payout */}
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-indigo-900">
                  최종 입금 예정 금액
                </span>
                <span className="text-xl font-black text-indigo-600">
                  {Math.max(
                    0,
                    pinItems
                      .filter((p) => p.status === "success" && p.faceValue)
                      .reduce((acc, curr) => acc + (curr.faceValue || 0), 0) *
                      (selectedVoucher
                        ? parseFloat(
                            selectedVoucher.purchaseRate.replace("%", ""),
                          ) / 100
                        : 0) -
                      500,
                  ).toLocaleString()}{" "}
                  원
                </span>
              </div>
            </div>

            <div className="mt-3 bg-white/60 rounded-lg p-3 text-[11px] text-slate-500 leading-snug">
              <span className="font-bold text-indigo-500">•</span> 실제 입금액은
              상품권 상태와 은행 사정에 따라 달라질 수 있습니다.
              <br />
              <span className="font-bold text-indigo-500">•</span> 이체 수수료
              500원은 매입 금액에서 차감되어 입금됩니다.
            </div>
          </div>
        )}

        {/* Important Notice */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 relative z-10">
          <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />꼭 알아두세요!
          </h4>
          <ul className="text-xs text-slate-500 space-y-1 pl-1">
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              신청 건당 이체수수료 500원이 부과됩니다.
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              신청이 완료되면 취소 및 환불이 불가합니다.
            </li>
          </ul>
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
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-black py-4 rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-[0.98] text-lg disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <span>신청 완료</span>
              </>
            )}
          </button>
        </div>
      </div>

      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Bank Selector Modal */}
      {isBankSelectorOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-4 font-sans">
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
              onClick={() => setIsBankSelectorOpen(false)}
            />
            <div className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl relative z-10 max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden">
              {/* Modal Header */}
              <div className="p-6 pb-4 border-b border-slate-100 shrink-0 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    금융기관 선택
                  </h3>
                  <button
                    onClick={() => setIsBankSelectorOpen(false)}
                    className="p-2 -mr-2 text-slate-400 hover:text-slate-600"
                    title="닫기"
                    aria-label="닫기"
                  >
                    <Minus className="rotate-45" size={24} />
                  </button>
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="은행/증권사 검색"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>

                {/* Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveTab("bank")}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                      activeTab === "bank"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    은행
                  </button>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                      activeTab === "security"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    증권사
                  </button>
                </div>
              </div>

              {/* Bank Grid */}
              <div className="overflow-y-auto p-4 scrollbar-hide bg-slate-50/50">
                {filteredBanks.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 font-medium">
                    검색 결과가 없습니다.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {filteredBanks.map((bank) => (
                      <button
                        key={bank.code}
                        onClick={() => handleBankSelect(bank.name)}
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-100 transition-all group aspect-[4/3]"
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-slate-700 bg-slate-50 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          {bank.name[0]}
                        </div>
                        <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 text-center break-keep">
                          {bank.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
