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
      theme="light"
      position="bottom-left"
      className="toaster group"
      dir="rtl"
      icons={{
        success: <CircleCheck className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        warning: <TriangleAlert className="h-4 w-4" />,
        error: <OctagonX className="h-4 w-4" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "#09090b",
          "--normal-border": "#e4e4e7",
          "--border-radius": "8px",
          "--toast-close-button-start": "unset",
          "--toast-close-button-end": "12px",
          "--toast-close-button-transform": "none",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-zinc-950 group-[.toaster]:border group-[.toaster]:border-zinc-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg font-sans flex items-center gap-3 p-4",
          title: "group-[.toast]:text-zinc-950 font-semibold text-sm tracking-tight",
          description: "group-[.toast]:text-zinc-500 text-xs mt-0.5",
          actionButton:
            "group-[.toast]:bg-blue-700 group-[.toast]:text-white group-[.toast]:font-medium group-[.toast]:text-xs group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:shadow-sm hover:group-[.toast]:bg-blue-800 transition-colors group-[.toast]:shrink-0",
          cancelButton:
            "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-700 group-[.toast]:font-medium group-[.toast]:text-xs group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1.5 hover:group-[.toast]:bg-zinc-200 transition-colors group-[.toast]:shrink-0",
          closeButton:
            "group-[.toast]:!static group-[.toast]:!order-last group-[.toast]:!transform-none group-[.toast]:!mr-2 group-[.toast]:!bg-transparent group-[.toast]:!border-0 group-[.toast]:!text-zinc-400 hover:group-[.toast]:!text-zinc-900 group-[.toast]:!h-6 group-[.toast]:!w-6 group-[.toast]:!flex group-[.toast]:!items-center group-[.toast]:!justify-center group-[.toast]:!p-0 group-[.toast]:cursor-pointer group-[.toast]:rounded-md hover:group-[.toast]:!bg-zinc-100 group-[.toast]:shrink-0 transition-colors",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
