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
            className={`group relative flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 transform hover:-translate-y-1 ${
              isSelected
                ? "bg-white shadow-xl shadow-indigo-200/50 scale-[1.02] ring-2 ring-indigo-500 ring-offset-2"
                : "bg-white/80 border border-slate-100/50 hover:bg-white hover:shadow-lg hover:shadow-indigo-100/30"
            }`}
          >
            {/* Active Gradient Border Effect (Optional visual enhancement) */}
            {isSelected && (
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-50/50 to-sky-50/50 opacity-10 pointer-events-none" />
            )}

            <div
              className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                isSelected
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 rotate-3"
                  : "bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500"
              }`}
            >
              <v.icon
                className={`w-8 h-8 transition-transform duration-300 ${isSelected ? "scale-110" : "scale-100"}`}
              />
            </div>

            <span
              className={`font-bold text-sm mb-2 transition-colors ${isSelected ? "text-slate-900" : "text-slate-600 group-hover:text-slate-800"}`}
            >
              {v.name}
            </span>

            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                isSelected
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"
              }`}
            >
              {v.purchaseRate}
            </span>
          </button>
        );
      })}
    </div>
  );
}
