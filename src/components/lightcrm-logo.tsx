import React from "react";

interface LightCrmLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}

export function LightCrmLogo({
  className = "",
  showWordmark = true,
  size = "md",
}: LightCrmLogoProps) {
  const iconSize = size === "sm" ? 24 : size === "lg" ? 36 : 28;
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-xl" : "text-lg";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Minimalist Tech Mark */}
      <div
        style={{ width: iconSize, height: iconSize }}
        className="relative shrink-0 flex items-center justify-center rounded-lg border border-white/15 bg-[#121218] shadow-sm"
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className="w-full h-full p-1"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Crisp geometric L */}
          <path
            d="M9 7V23H23"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Precision dynamic beam ray */}
          <path
            d="M13 19L24 8"
            stroke="#38bdf8"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="24" cy="8" r="1.8" fill="#38bdf8" />
        </svg>
      </div>

      {/* Solid Clean Typography - No Gradient */}
      {showWordmark && (
        <span className={`font-bold tracking-tight text-white flex items-center ${textSize}`}>
          <span>Light</span>
          <span className="font-semibold text-zinc-400 ml-0.5">CRM</span>
        </span>
      )}
    </div>
  );
}
