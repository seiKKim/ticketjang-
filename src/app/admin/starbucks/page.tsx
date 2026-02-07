"use client";

import { useState } from "react";
import {
  Coffee,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function StarbucksCheckPage() {
  const [cardNumber, setCardNumber] = useState("");
  const [pinNumber, setPinNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    balance?: number;
  } | null>(null);

  const handleCheck = async () => {
    if (!cardNumber || !pinNumber) {
      alert("카드번호와 핀번호를 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    setResult(null);

    // Format: Card(16) + Pin(8)
    const fullCode = cardNumber.replace(/-/g, "") + pinNumber;

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voucherType: "STARBUCKS",
          pinCode: fullCode,
        }),
      });

      const data = await res.json();

      if (data.isValid) {
        setResult({
          success: true,
          message: data.message,
          balance: data.faceValue,
        });
      } else {
        setResult({
          success: false,
          message: data.message || "조회 실패",
        });
      }
    } catch (error) {
      console.error(error);
      setResult({
        success: false,
        message: "서버 통신 오류",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-2xl text-green-700">
            <Coffee size={32} />
          </div>
          스타벅스 잔액 조회
        </h2>
        <p className="text-slate-500 mt-2 font-medium">
          실물 카드를 등록하고 잔액을 즉시 확인합니다. (자동 등록됨)
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 h-fit">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                스타벅스 카드 번호 (16자리)
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  if (val.length <= 16) setCardNumber(val);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-mono font-bold text-lg tracking-wider"
                placeholder="1234123412341234"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                핀번호 (8자리)
              </label>
              <input
                type="text"
                value={pinNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  if (val.length <= 8) setPinNumber(val);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-mono font-bold text-lg tracking-wider"
                placeholder="12345678"
              />
            </div>

            <button
              onClick={handleCheck}
              disabled={
                loading || cardNumber.length < 16 || pinNumber.length < 8
              }
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-200 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  조회중...
                </>
              ) : (
                <>
                  <RefreshCw size={20} />
                  잔액 조회하기
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Display */}
        <div className="space-y-6">
          {result ? (
            <div
              className={`p-8 rounded-3xl border ${
                result.success
                  ? "bg-green-50 border-green-200"
                  : "bg-rose-50 border-rose-200"
              } animate-in fade-in slide-in-from-bottom-4 duration-500`}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    result.success
                      ? "bg-green-100 text-green-600"
                      : "bg-rose-100 text-rose-600"
                  }`}
                >
                  {result.success ? (
                    <CheckCircle2 size={32} />
                  ) : (
                    <AlertCircle size={32} />
                  )}
                </div>

                <h3
                  className={`text-2xl font-black ${
                    result.success ? "text-green-800" : "text-rose-800"
                  }`}
                >
                  {result.success ? "조회 성공!" : "조회 실패"}
                </h3>

                {result.success && result.balance !== undefined && (
                  <div className="mt-2">
                    <p className="text-sm font-bold text-green-600 mb-1">
                      현재 잔액
                    </p>
                    <p className="text-4xl font-black text-green-700 tracking-tight">
                      {result.balance.toLocaleString()}
                      <span className="text-2xl ml-1">원</span>
                    </p>
                  </div>
                )}

                <p
                  className={`font-medium ${
                    result.success ? "text-green-700" : "text-rose-700"
                  }`}
                >
                  {result.message}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">
              <Coffee size={48} className="mb-4 opacity-20" />
              <p className="font-bold">카드 정보를 입력하고 조회해주세요.</p>
              <p className="text-sm mt-1">자동으로 계정에 등록됩니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
