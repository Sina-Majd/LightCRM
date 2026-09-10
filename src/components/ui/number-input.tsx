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
          "relative flex h-10 w-full items-center rounded-xl border border-white/10 bg-black/40 px-3 transition-colors duration-100 cursor-text",
          "focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/30 group",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {icon && (
          <div className="mr-2.5 shrink-0 text-zinc-400 group-focus-within:text-cyan-400 transition-colors pointer-events-none flex items-center justify-center">
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
          className="h-full w-full bg-transparent text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-none disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          {...props}
        />

        {showSteppers && (
          <div className="ml-2 flex flex-col items-center justify-center border-l border-white/[0.08] pl-1.5 shrink-0">
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                handleIncrement();
              }}
              className="flex h-3.5 w-4.5 items-center justify-center rounded text-zinc-400 hover:text-cyan-300 hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer disabled:opacity-30"
              aria-label="Increment"
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
              className="flex h-3.5 w-4.5 items-center justify-center rounded text-zinc-400 hover:text-cyan-300 hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer disabled:opacity-30"
              aria-label="Decrement"
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
