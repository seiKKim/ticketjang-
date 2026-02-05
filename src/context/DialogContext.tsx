"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type DialogType = "alert" | "confirm";

interface DialogOptions {
  type?: DialogType;
  title?: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface DialogContextType {
  isOpen: boolean;
  options: DialogOptions;
  openDialog: (options: DialogOptions) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DialogOptions>({
    type: "alert",
    message: "",
  });

  const openDialog = (opts: DialogOptions) => {
    setOptions({
      type: "alert", // Default
      ...opts,
    });
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <DialogContext.Provider
      value={{ isOpen, options, openDialog, closeDialog }}
    >
      {children}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}
