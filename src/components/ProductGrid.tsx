"use client";

import { usePurchase } from "@/context/PurchaseContext";
import { VOUCHERS } from "@/lib/constants";

export function ProductGrid() {
  const { selectedVoucherId, selectVoucher } = usePurchase();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
      {VOUCHERS.map((v) => {
        const isSelected = selectedVoucherId === v.id;
        return (
          <button
            key={v.id}
            onClick={() => selectVoucher(v.id)}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-200 transform hover:scale-[1.03] active:scale-[0.98] ${
              isSelected
                ? "border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-200"
                : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 hover:shadow-sm"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
                isSelected
                  ? "bg-white shadow-sm"
                  : "bg-slate-100 group-hover:bg-white"
              } ${v.color}`}
            >
              <v.icon className="w-7 h-7" />
            </div>
            <span className="font-bold text-slate-800 text-sm mb-1">
              {v.name}
            </span>
            <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-full">
              {v.purchaseRate}
            </span>
          </button>
        );
      })}
    </div>
  );
}
