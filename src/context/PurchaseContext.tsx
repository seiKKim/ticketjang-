"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { VOUCHERS } from "@/lib/constants";

interface BankInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  phoneNumber: string;
}

interface PurchaseContextType {
  selectedVoucherId: string | null;
  selectedVoucher: (typeof VOUCHERS)[0] | undefined;
  pinCodes: string[];
  bankInfo: BankInfo;
  selectVoucher: (id: string) => void;
  setPinCodes: (codes: string[]) => void;
  updateBankInfo: (info: Partial<BankInfo>) => void;
  addPin: () => void;
  removePin: (index: number) => void;
  updatePin: (index: number, value: string) => void;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(
  undefined,
);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(
    VOUCHERS[0]?.id || null,
  );
  const [pinCodes, setPinCodes] = useState<string[]>([""]); // Start with 1 empty pin
  const [bankInfo, setBankInfo] = useState<BankInfo>({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    phoneNumber: "",
  });

  const selectedVoucher = VOUCHERS.find((v) => v.id === selectedVoucherId);

  const selectVoucher = (id: string) => {
    setSelectedVoucherId(id);
    // Reset pins when changing voucher type? Maybe keep them if user accidentally clicks.
    // Let's keep them for better UX.
  };

  const updateBankInfo = (info: Partial<BankInfo>) => {
    setBankInfo((prev) => ({ ...prev, ...info }));
  };

  const addPin = () => {
    setPinCodes((prev) => [...prev, ""]);
  };

  const removePin = (index: number) => {
    if (pinCodes.length === 1) {
      // Don't remove the last one, just clear it
      updatePin(0, "");
      return;
    }
    setPinCodes((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePin = (index: number, value: string) => {
    const newPins = [...pinCodes];
    newPins[index] = value;
    setPinCodes(newPins);
  };

  return (
    <PurchaseContext.Provider
      value={{
        selectedVoucherId,
        selectedVoucher,
        pinCodes,
        bankInfo,
        selectVoucher,
        setPinCodes,
        updateBankInfo,
        addPin,
        removePin,
        updatePin,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchase() {
  const context = useContext(PurchaseContext);
  if (context === undefined) {
    throw new Error("usePurchase must be used within a PurchaseProvider");
  }
  return context;
}
