import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
  {
    variants: {
      variant: {
        default:
          "border-white/10 bg-white/[0.06] text-zinc-300 backdrop-blur-md",
        secondary:
          "border-zinc-800 bg-zinc-900 text-zinc-400",
        destructive:
          "border-red-500/30 bg-red-500/10 text-red-300",
        outline:
          "border-white/15 text-zinc-300",
        indigo:
          "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
        purple:
          "border-purple-500/30 bg-purple-500/10 text-purple-300",
        cyan:
          "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
        emerald:
          "border-emerald-500/30 bg-emerald-950/40 text-emerald-300",
        amber:
          "border-amber-500/30 bg-amber-950/40 text-amber-300",
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
