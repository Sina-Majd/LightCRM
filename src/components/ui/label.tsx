import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  requiredIndicator?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, requiredIndicator, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-xs font-medium text-zinc-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none flex items-center gap-1",
        className
      )}
      {...props}
    >
      {children}
      {requiredIndicator && <span className="text-cyan-400">*</span>}
    </label>
  )
);
Label.displayName = "Label";

export { Label };
