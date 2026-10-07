import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
  {
    variants: {
      variant: {
        default:
          "border-zinc-200 bg-zinc-100 text-zinc-700",
        secondary:
          "border-zinc-200 bg-zinc-100 text-zinc-600",
        destructive:
          "border-red-200 bg-red-50 text-red-700",
        outline:
          "border-zinc-300 text-zinc-600 bg-white",
        indigo:
          "border-indigo-200 bg-indigo-50 text-indigo-800",
        purple:
          "border-violet-200 bg-violet-50 text-violet-800",
        cyan:
          "border-blue-200 bg-blue-50 text-blue-800",
        emerald:
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        amber:
          "border-amber-200 bg-amber-50 text-amber-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
