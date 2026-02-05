"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
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

function PurchaseProviderContent({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const voucherParam = searchParams.get("voucher");

  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(
    () => {
      if (voucherParam && VOUCHERS.some((v) => v.id === voucherParam)) {
        return voucherParam;
      }
      return VOUCHERS[0]?.id || null;
    },
  );

  // Update selection if URL changes while mounted
  useEffect(() => {
    if (voucherParam && VOUCHERS.some((v) => v.id === voucherParam)) {
      setSelectedVoucherId(voucherParam);
    }
  }, [voucherParam]);

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

export function PurchaseProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PurchaseProviderContent>{children}</PurchaseProviderContent>
    </Suspense>
  );
}

export function usePurchase() {
  const context = useContext(PurchaseContext);
  if (context === undefined) {
    throw new Error("usePurchase must be used within a PurchaseProvider");
  }
  return context;
}
