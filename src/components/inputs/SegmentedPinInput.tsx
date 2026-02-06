"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface SegmentedPinInputProps {
  value: string;
  onChange: (value: string) => void;
  segments?: number[];
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  status?: "idle" | "loading" | "success" | "error";
}

export function SegmentedPinInput({
  value,
  onChange,
  segments = [4, 4, 4, 4],
  disabled = false,
  className,
  placeholder,
  status,
}: SegmentedPinInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Split value into array based on segments
  // We need to maintain the "part" values in local state to avoid cursor jumping
  // but "value" prop is the source of truth.
  // Actually, deriving parts from value is safer for controlled components.

  const getParts = () => {
    // Strip non-alphanumeric characters to handle hyphenated values
    const cleanValue = value.replace(/[^a-zA-Z0-9]/g, "");
    let currentPos = 0;
    const parts = segments.map((len) => {
      const part = cleanValue.slice(currentPos, currentPos + len);
      currentPos += len;
      return part;
    });
    return parts;
  };

  const parts = getParts();

  const handlePartChange = (index: number, newValue: string) => {
    // Force uppercase
    const upperValue = newValue.toUpperCase();

    // Only allow numbers (and maybe specific valid chars if needed, but usually numbers)
    // For universal usage, let's allow alphanumeric but maybe we can restrain it later.
    // Culture land is digits.

    // Trim to segment length
    const maxLen = segments[index];
    const slicedValue = upperValue.slice(0, maxLen);

    const newParts = [...parts];
    newParts[index] = slicedValue;

    // Auto-focus next if full
    if (slicedValue.length >= maxLen && index < segments.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    const formatted = newParts.join("-");
    onChange(formatted);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && parts[index].length === 0 && index > 0) {
      // Move to previous input
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "") // Strip non-alphanumeric
      .toUpperCase(); // Force Uppercase

    if (!pastedData) return;

    let currentIdx = 0;
    const newParts = [...parts];

    segments.forEach((len, i) => {
      if (currentIdx < pastedData.length) {
        newParts[i] = pastedData.slice(currentIdx, currentIdx + len);
        currentIdx += len;
      }
    });

    onChange(newParts.join("-"));

    // Focus the last filled input or the first empty one
    // Simple heuristic: focus the last one
    inputsRef.current[segments.length - 1]?.focus();
  };

  return (
    <div className={cn("flex gap-2 items-center", className)}>
      {segments.map((length, idx) => (
        <React.Fragment key={idx}>
          <input
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            value={parts[idx] || ""}
            onChange={(e) => handlePartChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={idx === 0 ? handlePaste : undefined} // Allow paste on first field mainly
            maxLength={length}
            disabled={disabled}
            placeholder={idx === 0 ? placeholder : `${length}자리`}
            style={{ flex: length }}
            className={cn(
              "bg-slate-50 border rounded-xl text-center py-3.5 text-sm outline-none transition-all font-mono font-medium hover:bg-white focus:bg-white min-w-0 w-full",
              status === "success"
                ? "border-emerald-400 ring-1 ring-emerald-400/20 bg-emerald-50/50"
                : status === "error"
                  ? "border-rose-400 ring-1 ring-rose-400/20 bg-rose-50/50"
                  : "border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
              disabled && "opacity-50 cursor-not-allowed bg-slate-100",
            )}
          />
          {/* Dash separator */}
          {idx < segments.length - 1 && (
            <span className="text-slate-300 font-bold shrink-0">-</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
