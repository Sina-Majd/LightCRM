import React from "react";
import { BarChart3, Bell, FileText, KanbanSquare, Search, UserRound } from "lucide-react";
import { Reveal } from "@/components/landing/reveal";
import { SectionHeading } from "@/components/landing/section-heading";
import {
  CustomerList,
  KanbanDemo,
  ReceiptChip,
  SearchBox,
  StatSpark,
  TaskList,
} from "@/components/landing/feature-visuals";

/*
 * Bento rules used here (see research notes in the PR/chat):
 *  - one hero cell (2x2) holds the live demo; everything else is quieter
 *  - content types differ per cell: demo, stat, receipt, list, list, search
 *  - explicit 4-column grid and fixed row heights on large screens
 *  - one accent surface (blue) and one dark surface (hero); the rest are neutral
 *  - single column on phones, hero first; two columns on tablets
 *  - markup is a real list so assistive tech announces the count
 */

type Tone = "light" | "dark" | "accent";
type Variant = "hero" | "compact" | "split";

const TONE: Record<Tone, { box: string; title: string; text: string; icon: string; style?: React.CSSProperties }> = {
  light: {
    box: "border border-brand-100 bg-white shadow-[0_1px_2px_rgba(16,28,69,0.04),0_18px_40px_-30px_rgba(16,28,69,0.3)]",
    title: "text-brand-950",
    text: "text-slate-600",
    icon: "bg-brand-50 text-brand-600",
  },
  dark: {
    box: "bg-brand-950 shadow-[0_30px_60px_-34px_rgba(10,18,50,0.8)]",
    title: "text-white",
    text: "text-brand-200/80",
    icon: "bg-white/10 text-glow ring-1 ring-white/15",
  },
  accent: {
    box: "shadow-[0_30px_60px_-34px_rgba(33,73,168,0.8)]",
    title: "text-white",
    text: "text-brand-100/90",
    icon: "bg-white/15 text-white ring-1 ring-white/20",
    style: { backgroundImage: "linear-gradient(150deg, #2c5bd0 0%, #1c3a8a 60%, #101c45 100%)" },
  },
};

function Cell({
  tone = "light",
  variant,
  icon: Icon,
  title,
  text,
  className = "",
  delay = 0,
  children,
}: {
  tone?: Tone;
  variant: Variant;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  const s = TONE[tone];
  const split = variant === "split";
  const hero = variant === "hero";

  const iconTile = (
    <span className={`flex shrink-0 items-center justify-center rounded-2xl ${hero ? "h-12 w-12" : "h-11 w-11"} ${s.icon}`}>
      <Icon className={hero ? "h-6 w-6" : "h-[22px] w-[22px]"} />
    </span>
  );

  return (
    <li className={`min-w-0 ${className}`}>
      <Reveal delay={delay} className="h-full">
        <article
          className={`relative flex h-full overflow-hidden rounded-[28px] transition-transform duration-300 hover:-translate-y-0.5 ${
            hero ? "flex-col p-7 sm:p-8" : split ? "flex-col gap-5 p-6 sm:flex-row sm:items-center sm:gap-7 sm:p-7" : "flex-col p-6"
          } ${s.box}`}
          style={s.style}
        >
          {/* surface decoration (kept subtle) */}
          {tone === "dark" && (
            <>
              <div aria-hidden="true" className="lp-dark-grid absolute inset-0 opacity-50" />
              <div aria-hidden="true" className="absolute -start-20 -top-24 h-64 w-64 rounded-full bg-brand-500/35 blur-3xl" />
              <div aria-hidden="true" className="absolute -bottom-24 -end-12 h-56 w-56 rounded-full bg-glow/15 blur-3xl" />
            </>
          )}
          {tone === "accent" && (
            <>
              <div aria-hidden="true" className="absolute -end-20 -top-20 h-56 w-56 rounded-full border border-white/10" />
              <div aria-hidden="true" className="absolute -end-10 -top-10 h-36 w-36 rounded-full border border-white/10" />
            </>
          )}

          {/* copy */}
          <div className={`relative ${split ? "sm:w-[42%] sm:shrink-0" : ""}`}>
            {variant === "compact" ? (
              <div className="flex items-center gap-3">
                {iconTile}
                <h3 className={`text-[18px] font-black ${s.title}`}>{title}</h3>
              </div>
            ) : (
              <>
                {iconTile}
                <h3 className={`mt-4 font-black ${hero ? "text-[24px]" : "text-[19px]"} ${s.title}`}>{title}</h3>
              </>
            )}
            <p className={`mt-2 text-[14px] leading-7 ${hero ? "max-w-md" : ""} ${s.text}`}>{text}</p>
          </div>

          {/* visual */}
          <div className={`relative min-w-0 ${split ? "sm:flex-1" : "mt-auto pt-5"}`}>{children}</div>
        </article>
      </Reveal>
    </li>
  );
}

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 bg-brand-50/60 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            wide
            title={
              <>
                هرچه برای فروش و پیگیری مشتری لازم دارید،
                <br className="hidden sm:block" />{" "}
                <span className="lp-gradient-text">در یک‌جا</span> و کنار هم
              </>
            }
            description="بدون منوهای پیچیده و بدون آموزش طولانی. هر بخش همان کاری را می‌کند که اسمش می‌گوید."
          />
        </Reveal>

        <ul role="list" className="mt-14 grid min-w-0 gap-4 md:grid-cols-2 lg:auto-rows-[264px] lg:grid-cols-4">
          {/* 1 · hero: the live demo, 2x2 */}
          <Cell
            tone="dark"
            variant="hero"
            icon={KanbanSquare}
            title="پایپ‌لاین بصری معاملات"
            text="معامله‌ها را بکشید و رها کنید. هر مرحله، از اولین تماس تا تحویل، جلوی چشم شماست."
            className="md:col-span-2 lg:row-span-2"
          >
            <KanbanDemo />
          </Cell>

          {/* 2 · stat */}
          <Cell variant="compact" icon={BarChart3} title="گزارش‌های شفاف" text="درآمد و روند فروش، همیشه روشن." delay={0.05}>
            <StatSpark />
          </Cell>

          {/* 3 · the single accent cell */}
          <Cell tone="accent" variant="compact" icon={FileText} title="فاکتور فارسی" text="با لوگوی شما و لینک پرداخت." delay={0.1}>
            <ReceiptChip />
          </Cell>

          {/* 4 · list */}
          <Cell
            variant="split"
            icon={UserRound}
            title="مشتریان و سرنخ‌ها"
            text="تاریخچه سفارش‌ها و یادداشت‌های هر مشتری، در یک نگاه."
            className="md:col-span-2"
            delay={0.05}
          >
            <CustomerList />
          </Cell>

          {/* 5 · list */}
          <Cell
            variant="split"
            icon={Bell}
            title="وظایف و یادآوری"
            text="قرارها را ثبت کنید؛ لایت به موقع یادآوری می‌کند."
            className="md:col-span-2"
          >
            <TaskList />
          </Cell>

          {/* 6 · search */}
          <Cell
            variant="split"
            icon={Search}
            title="جستجوی فوری"
            text="با یک میان‌بر، هر مشتری یا سفارشی را در چند ثانیه پیدا کنید."
            className="md:col-span-2"
            delay={0.05}
          >
            <SearchBox />
          </Cell>
        </ul>
      </div>
    </section>
  );
}
