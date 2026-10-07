import React from "react";

const ROW_A = ["آژانس‌ها", "مشاوران", "فروشگاه‌ها", "پیمانکاران", "فروشگاه‌های آنلاین", "فریلنسرها"];
const ROW_B = ["کافه‌ها و رستوران‌ها", "کلینیک‌ها", "آموزشگاه‌ها", "املاک", "عکاسان", "کارگاه‌های تولیدی"];

function DividerDot() {
  return (
    <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400/70" />
  );
}

function Track({ words, tone, hidden = false }: { words: string[]; tone: string; hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" dir="rtl" aria-hidden={hidden || undefined}>
      {words.map((w) => (
        <div key={w} className="flex shrink-0 items-center gap-[0.55em] pe-[0.55em]">
          <span className={`whitespace-nowrap transition-colors duration-300 ${tone}`}>{w}</span>
          <DividerDot />
        </div>
      ))}
    </div>
  );
}

function Row({
  words,
  tone,
  reverse = false,
  duration,
}: {
  words: string[];
  tone: string;
  reverse?: boolean;
  duration: string;
}) {
  return (
    <div className="lp-marquee-wrap lp-marquee-mask overflow-hidden" dir="ltr">
      <div
        className={`lp-marquee text-[30px] font-black leading-[1.6] sm:text-[38px] lg:text-[46px] ${reverse ? "lp-marquee-rev" : ""}`}
        style={{ animationDuration: duration }}
      >
        <Track words={words} tone={tone} />
        <Track words={words} tone={tone} hidden />
      </div>
    </div>
  );
}

export function AudienceStrip() {
  return (
    <section className="bg-white py-6 sm:py-10">
      <div className="border-y border-brand-100/80 py-3 sm:py-5">
        <Row words={ROW_A} tone="text-brand-950 hover:text-brand-600" duration="52s" />
        <Row words={ROW_B} tone="text-brand-300 hover:text-brand-500" reverse duration="62s" />
      </div>
    </section>
  );
}
