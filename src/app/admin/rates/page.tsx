"use client";

import { VOUCHERS } from "@/lib/constants";
import { useState, useEffect } from "react";
import { Save, RefreshCw, Plus, Trash2, Power, X } from "lucide-react";
import { useDialog } from "@/context/DialogContext";

interface Rate {
  id: string;
  voucherType: string;
  buyRate: number;
  isActive: boolean;
}

export default function RatesPage() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { openDialog } = useDialog();

  // New Voucher Form
  const [newVoucherType, setNewVoucherType] = useState("");
  const [newBuyRate, setNewBuyRate] = useState("0.90");

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rates");
      const data = await res.json();
      setRates(data);
    } catch (e) {
      console.error("Failed to fetch rates");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (voucherType: string, buyRate: number) => {
    try {
      const res = await fetch("/api/admin/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voucherType, buyRate }),
      });
      if (res.ok) {
        openDialog({
          title: "알림",
          message: "정상적으로 수정 또는 저장 되었습니다.",
          type: "alert",
        });
        fetchRates();
      }
    } catch (e) {
      console.error(e);
      openDialog({ message: "저장 실패" });
    }
  };

  const handleAddVoucher = async () => {
    if (!newVoucherType)
      return openDialog({ message: "상품권 코드를 입력해주세요." });
    await handleUpdate(newVoucherType, parseFloat(newBuyRate));
    setIsAddModalOpen(false);
    setNewVoucherType("");
  };

  const handleDelete = async (voucherType: string) => {
    openDialog({
      type: "confirm",
      message: `${voucherType} 상품권을 정말 삭제하시겠습니까?`,
      onConfirm: async () => {
        try {
          const res = await fetch(
            `/api/admin/rates?voucherType=${voucherType}`,
            {
              method: "DELETE",
            },
          );
          if (res.ok) fetchRates();
        } catch (e) {
          console.error(e);
        }
      },
    });
  };

  const handleToggle = async (voucherType: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/rates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voucherType, isActive: !currentStatus }),
      });
      if (res.ok) fetchRates();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8">로딩중...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">시세 관리</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} /> 상품권 추가
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rates.map((rate) => (
          <RateItem
            key={`${rate.id}-${rate.buyRate}`}
            rate={rate}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">새 상품권 추가</h3>
              <button onClick={() => setIsAddModalOpen(false)} title="닫기">
                <X className="text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  상품권 코드 (ID)
                </label>
                <input
                  autoFocus
                  placeholder="예: TEST_VOUCHER"
                  value={newVoucherType}
                  onChange={(e) =>
                    setNewVoucherType(e.target.value.toUpperCase())
                  }
                  className="w-full border p-3 rounded-lg uppercase text-slate-900"
                />
                <p className="text-xs text-slate-400 mt-1">
                  영문 대문자, 숫자, 언더바(_)만 사용 가능
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  기본 매입률
                </label>
                <input
                  type="number"
                  step="0.01"
                  title="기본 매입률"
                  placeholder="예: 0.90"
                  value={newBuyRate}
                  onChange={(e) => setNewBuyRate(e.target.value)}
                  className="w-full border p-3 rounded-lg text-slate-900"
                />
              </div>
              <button
                onClick={handleAddVoucher}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RateItem({
  rate,
  onUpdate,
  onDelete,
  onToggle,
}: {
  rate: Rate;
  onUpdate: (type: string, rate: number) => void;
  onDelete: (type: string) => void;
  onToggle: (type: string, status: boolean) => void;
}) {
  const [val, setVal] = useState(rate.buyRate.toString());

  return (
    <div
      className={`bg-white p-6 rounded-xl border shadow-sm transition-all ${
        !rate.isActive
          ? "opacity-60 grayscale border-slate-200"
          : "border-indigo-100 hover:shadow-md"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            {VOUCHERS.find((v) => v.id === rate.voucherType)?.name ||
              rate.voucherType}
            {!rate.isActive && (
              <span className="text-xs bg-slate-200 text-slate-500 px-2 py-0.5 rounded">
                비활성
              </span>
            )}
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {rate.voucherType}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onToggle(rate.voucherType, rate.isActive)}
            title={rate.isActive ? "비활성화" : "활성화"}
            className={`p-2 rounded-lg ${rate.isActive ? "text-slate-400 hover:bg-slate-50" : "text-green-600 bg-green-50"}`}
          >
            <Power size={18} />
          </button>
          <button
            onClick={() => onDelete(rate.voucherType)}
            title="삭제"
            className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            매입률 (0.0 ~ 1.0)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              title="매입률"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
            />
            <button
              onClick={() => onUpdate(rate.voucherType, parseFloat(val))}
              className="bg-indigo-600 text-white px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
              title="저장"
            >
              <Save size={18} />
            </button>
          </div>
        </div>
        <div className="flex justify-between text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
          <span>매입가 ({Number(val || 0) * 100}%)</span>
          <span>수수료 {Math.round((1 - Number(val || 0)) * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
