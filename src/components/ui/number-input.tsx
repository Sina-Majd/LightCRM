"use client";

import * as React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  value?: number | string;
  onChange?: (val: number | string) => void;
  step?: number;
  min?: number;
  max?: number;
  icon?: React.ReactNode;
  showSteppers?: boolean;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      value = "",
      onChange,
      step = 1,
      min,
      max,
      icon,
      showSteppers = true,
      disabled,
      placeholder,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleIncrement = () => {
      if (disabled) return;
      const current = typeof value === "number" ? value : parseFloat(value as string) || 0;
      const next = current + step;
      if (max !== undefined && next > max) return;
      onChange?.(next);
    };

    const handleDecrement = () => {
      if (disabled) return;
      const current = typeof value === "number" ? value : parseFloat(value as string) || 0;
      const next = current - step;
      if (min !== undefined && next < min) return;
      onChange?.(next);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val === "") {
        onChange?.("");
        return;
      }
      const parsed = parseFloat(val);
      onChange?.(isNaN(parsed) ? val : parsed);
    };

    return (
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "relative flex h-10 w-full items-center rounded-xl border border-brand-100 bg-white px-3 transition hover:border-brand-200 cursor-text",
          "focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-600/20 group",
          disabled && "opacity-50 cursor-not-allowed bg-slate-50",
          className
        )}
      >
        {icon && (
          <div className="ml-2.5 shrink-0 text-slate-400 group-focus-within:text-brand-700 transition-colors pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}

        <input
          type="number"
          ref={inputRef}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className="h-full w-full bg-transparent text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          {...props}
        />

        {showSteppers && (
          <div className="mr-2 flex flex-col items-center justify-center border-r border-slate-100 pr-1.5 shrink-0">
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                handleIncrement();
              }}
              className="flex h-3.5 w-4 items-center justify-center rounded text-slate-400 hover:text-brand-700 hover:bg-brand-50 active:scale-95 transition-all cursor-pointer disabled:opacity-30"
              aria-label="افزایش"
            >
              <ChevronUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                handleDecrement();
              }}
              className="flex h-3.5 w-4 items-center justify-center rounded text-slate-400 hover:text-brand-700 hover:bg-brand-50 active:scale-95 transition-all cursor-pointer disabled:opacity-30"
              aria-label="کاهش"
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    );
  }
);
NumberInput.displayName = "NumberInput";

export { NumberInput };
