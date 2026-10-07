import React from "react";
import Image from "next/image";

interface LightCrmLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  /** "light" renders an all-white logo for use on dark backgrounds. */
  variant?: "default" | "light";
  /** Preload logo image for above-the-fold displays. Default is false. */
  priority?: boolean;
}

// Trimmed logo artwork is 1251 × 715.
const ASPECT = 1251 / 715;
const HEIGHTS = { sm: 36, md: 46, lg: 64 } as const;

export function LightCrmLogo({
  className = "",
  showWordmark = false,
  size = "md",
  variant = "default",
  priority = false,
}: LightCrmLogoProps) {
  const height = HEIGHTS[size];
  const width = Math.round(height * ASPECT);

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <Image
        src={variant === "light" ? "/light-logo-mark-white.png" : "/light-logo-mark.png"}
        alt="لایت CRM"
        width={width}
        height={height}
        priority={priority}        className="object-contain"
        style={{ height, width }}
      />
      {showWordmark && (
        <span className={`text-lg font-bold ${variant === "light" ? "text-white" : "text-ink"}`}>
          لایت
        </span>
      )}
    </div>
  );
}
