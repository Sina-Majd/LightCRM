import React from "react";

interface SectionHeadingProps {
  /** Small pill above the title. Omit to render the title alone. */
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "start";
  tone?: "light" | "dark";
  /** Lets the title run wider (about 56rem) for longer headlines. */
  wide?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  wide = false,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  const width = wide ? "max-w-4xl" : "max-w-2xl";
  return (
    <div className={`min-w-0 ${align === "center" ? `mx-auto ${width} text-center` : width}`}>
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] font-bold ${
            dark
              ? "border-white/15 bg-white/5 text-brand-200"
              : "border-brand-100 bg-brand-50 text-brand-700"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-glow" />
          {eyebrow}
        </span>
      )}
      <h2
        className={`${eyebrow ? "mt-5" : ""} text-balance text-[28px] font-black leading-[1.5] sm:text-[40px] ${
          dark ? "text-white" : "text-brand-950"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-balance text-[15px] leading-8 sm:text-[16.5px] sm:leading-9 ${
            align === "center" ? "mx-auto max-w-2xl" : ""
          } ${dark ? "text-brand-200/80" : "text-slate-600"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
