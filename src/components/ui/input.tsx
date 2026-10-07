import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, rightElement, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    if (icon || rightElement) {
      return (
        <div
          onClick={() => inputRef.current?.focus()}
          className={cn(
            "flex h-10 w-full items-center rounded-xl border border-brand-100 bg-white px-3 transition hover:border-brand-200 cursor-text",
            "focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-600/20 group",
            className
          )}
        >
          {icon && (
            <div className="me-2.5 shrink-0 text-slate-400 group-focus-within:text-brand-700 transition-colors pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={inputRef}
            className="h-full w-full bg-transparent text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 text-start [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            {...props}
          />
          {rightElement && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="ms-2 shrink-0 flex items-center justify-center cursor-default"
            >
              {rightElement}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        ref={inputRef}
        className={cn(
          "flex h-10 w-full rounded-xl border border-brand-100 bg-white px-3 py-2 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:cursor-not-allowed disabled:opacity-50 transition hover:border-brand-200 text-start [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
