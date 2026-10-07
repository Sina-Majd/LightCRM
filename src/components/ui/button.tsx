import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-blue-700 text-white font-semibold shadow-lg shadow-blue-700/20 hover:bg-blue-800",
        destructive:
          "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100",
        outline:
          "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 hover:border-zinc-400",
        secondary:
          "bg-zinc-100 text-zinc-800 border border-zinc-200 hover:bg-zinc-200",
        ghost:
          "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950",
        link:
          "text-blue-700 underline-offset-4 hover:underline",
        glow:
          "bg-blue-700 text-white font-semibold shadow-lg shadow-blue-700/25 hover:bg-blue-800",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6 py-3.5 text-sm font-semibold",
        icon: "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
