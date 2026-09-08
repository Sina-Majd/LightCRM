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
            "flex h-11 w-full items-center rounded-xl border border-white/10 bg-white/[0.03] px-3.5 transition-colors duration-100 cursor-text",
            "focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/30 group",
            className
          )}
        >
          {icon && (
            <div className="mr-3 shrink-0 text-zinc-300 group-focus-within:text-cyan-400 transition-colors duration-75 pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={inputRef}
            className="h-full w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            {...props}
          />
          {rightElement && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="ml-2.5 shrink-0 flex items-center justify-center cursor-default"
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
        className={cn(
          "flex h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white backdrop-blur-md placeholder:text-zinc-500 focus-visible:border-indigo-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

