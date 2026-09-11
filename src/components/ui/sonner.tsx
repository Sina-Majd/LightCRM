"use client";

import * as React from "react";
import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      className="toaster group"
      icons={{
        success: <CircleCheck className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        warning: <TriangleAlert className="h-4 w-4" />,
        error: <OctagonX className="h-4 w-4" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "#09090b",
          "--normal-text": "#ffffff",
          "--normal-border": "#27272a",
          "--border-radius": "8px",
          "--toast-close-button-start": "unset",
          "--toast-close-button-end": "12px",
          "--toast-close-button-transform": "none",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#09090b] group-[.toaster]:text-white group-[.toaster]:border group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg font-sans flex items-center gap-3 p-4",
          title: "group-[.toast]:text-white font-semibold text-sm tracking-tight",
          description: "group-[.toast]:text-zinc-400 text-xs mt-0.5",
          actionButton:
            "group-[.toast]:bg-white group-[.toast]:text-zinc-950 group-[.toast]:font-medium group-[.toast]:text-xs group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:shadow-sm hover:group-[.toast]:bg-zinc-200 transition-colors group-[.toast]:shrink-0",
          cancelButton:
            "group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-300 group-[.toast]:font-medium group-[.toast]:text-xs group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1.5 hover:group-[.toast]:bg-zinc-700 transition-colors group-[.toast]:shrink-0",
          closeButton:
            "group-[.toast]:!static group-[.toast]:!order-last group-[.toast]:!transform-none group-[.toast]:!ml-2 group-[.toast]:!bg-transparent group-[.toast]:!border-0 group-[.toast]:!text-zinc-400 hover:group-[.toast]:!text-white group-[.toast]:!h-6 group-[.toast]:!w-6 group-[.toast]:!flex group-[.toast]:!items-center group-[.toast]:!justify-center group-[.toast]:!p-0 group-[.toast]:cursor-pointer group-[.toast]:rounded-md hover:group-[.toast]:!bg-zinc-800/80 group-[.toast]:shrink-0 transition-colors",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
