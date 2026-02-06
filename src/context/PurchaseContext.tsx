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

export interface PinItem {
  code: string;
  status: "idle" | "loading" | "success" | "error";
  message?: string;
  isVerified: boolean;
  faceValue?: number;
}

interface BankInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  phoneNumber: string;
}

interface PurchaseContextType {
  selectedVoucherId: string | null;
  selectedVoucher: (typeof VOUCHERS)[0] | undefined;
  pinItems: PinItem[];
  bankInfo: BankInfo;
  selectVoucher: (id: string) => void;
  setPinItems: (items: PinItem[]) => void;
  updateBankInfo: (info: Partial<BankInfo>) => void;
  addPin: () => void;
  removePin: (index: number) => void;
  updatePinCode: (index: number, code: string) => void;
  updatePinStatus: (index: number, updates: Partial<PinItem>) => void;
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

  const [pinItems, setPinItems] = useState<PinItem[]>([
    {
      code: "",
      status: "idle",
      isVerified: false,
    },
  ]);

  const [bankInfo, setBankInfo] = useState<BankInfo>({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    phoneNumber: "",
  });

  const selectedVoucher = VOUCHERS.find((v) => v.id === selectedVoucherId);

  const selectVoucher = (id: string) => {
    setSelectedVoucherId(id);
    setPinItems([{ code: "", status: "idle", isVerified: false }]);
  };

  const updateBankInfo = (info: Partial<BankInfo>) => {
    setBankInfo((prev) => ({ ...prev, ...info }));
  };

  const addPin = () => {
    setPinItems((prev) => [
      ...prev,
      { code: "", status: "idle", isVerified: false },
    ]);
  };

  const removePin = (index: number) => {
    if (pinItems.length === 1) {
      // Don't remove the last one, just clear it
      updatePinCode(0, "");
      return;
    }
    setPinItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePinCode = (index: number, code: string) => {
    setPinItems((prev) => {
      const newItems = [...prev];
      newItems[index] = {
        ...newItems[index],
        code,
        // Reset status if changed
        status: "idle",
        isVerified: false,
        message: undefined,
      };
      return newItems;
    });
  };

  const updatePinStatus = (index: number, updates: Partial<PinItem>) => {
    setPinItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], ...updates };
      return newItems;
    });
  };

  return (
    <PurchaseContext.Provider
      value={{
        selectedVoucherId,
        selectedVoucher,
        pinItems,
        bankInfo,
        selectVoucher,
        setPinItems,
        updateBankInfo,
        addPin,
        removePin,
        updatePinCode,
        updatePinStatus,
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
