"use client";

import { useDialog } from "@/context/DialogContext";
import { X, AlertCircle, CheckCircle, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function GlobalDialog() {
  const { isOpen, options, closeDialog } = useDialog();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 200); // Wait for animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible) return null;

  const handleConfirm = () => {
    if (options.onConfirm) options.onConfirm();
    closeDialog();
  };

  const handleCancel = () => {
    if (options.onCancel) options.onCancel();
    closeDialog();
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Dialog Card */}
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all duration-200 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {options.type === "confirm" ? (
              <div className="p-2 bg-indigo-50 rounded-full text-indigo-600">
                <HelpCircle size={24} />
              </div>
            ) : (
              <div className="p-2 bg-indigo-50 rounded-full text-indigo-600">
                <AlertCircle size={24} />
              </div>
            )}
            <h3 className="text-lg font-bold text-slate-800">
              {options.title || (options.type === "confirm" ? "확인" : "알림")}
            </h3>
          </div>

          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
            {options.message}
          </p>
        </div>

        <div className="flex bg-slate-50 p-4 gap-3 justify-end">
          {options.type === "confirm" && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors"
            >
              취소
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
