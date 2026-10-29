import type { PipelineStage } from "./types";

export interface StageTheme {
  color: string;
  accentBorder: string;
  bgGradient: string;
}

export const STAGE_THEMES: Record<string, StageTheme> = {
  "stage-new": {
    color: "text-cyan-600 dark:text-cyan-400",
    accentBorder: "border-cyan-500/30",
    bgGradient: "from-cyan-500/10 to-transparent",
  },
  "stage-qualified": {
    color: "text-blue-600 dark:text-blue-400",
    accentBorder: "border-blue-500/30",
    bgGradient: "from-blue-500/10 to-transparent",
  },
  "stage-proposal": {
    color: "text-indigo-600 dark:text-indigo-400",
    accentBorder: "border-indigo-500/30",
    bgGradient: "from-indigo-500/10 to-transparent",
  },
  "stage-negotiation": {
    color: "text-amber-600 dark:text-amber-400",
    accentBorder: "border-amber-500/30",
    bgGradient: "from-amber-500/10 to-transparent",
  },
  "stage-won": {
    color: "text-emerald-600 dark:text-emerald-400",
    accentBorder: "border-emerald-500/30",
    bgGradient: "from-emerald-500/10 to-transparent",
  },
};

export const DEFAULT_STAGE_THEME: StageTheme = {
  color: "text-cyan-600 dark:text-cyan-400",
  accentBorder: "border-cyan-500/30",
  bgGradient: "from-cyan-500/10 to-transparent",
};

export function getStageTheme(stageId: string): StageTheme {
  return STAGE_THEMES[stageId] ?? DEFAULT_STAGE_THEME;
}

export const DEFAULT_PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "stage-new",
    title: "سرنخ جدید",
    ...STAGE_THEMES["stage-new"],
  },
  {
    id: "stage-qualified",
    title: "بررسی و صلاحیت",
    ...STAGE_THEMES["stage-qualified"],
  },
  {
    id: "stage-proposal",
    title: "ارسال پیش‌فاکتور",
    ...STAGE_THEMES["stage-proposal"],
  },
  {
    id: "stage-negotiation",
    title: "مذاکره و توافق",
    ...STAGE_THEMES["stage-negotiation"],
  },
  {
    id: "stage-won",
    title: "موفق و بسته شد",
    ...STAGE_THEMES["stage-won"],
  },
];

/** Resolve built-in keys first, with support for existing custom Persian stages. */
export function probabilityForStage(stages: readonly PipelineStage[], target: string): number {
  const probabilities: Record<string, number> = {
    "stage-new": 30,
    "stage-qualified": 50,
    "stage-proposal": 70,
    "stage-negotiation": 85,
    "stage-won": 100,
  };
  if (Object.hasOwn(probabilities, target)) return probabilities[target];

  const title = stages.find((stage) => stage.id === target)?.title ?? "";
  if (title.includes("موفق")) return 100;
  if (title.includes("مذاکره")) return 85;
  if (title.includes("پیش‌فاکتور")) return 70;
  if (title.includes("ارزیابی")) return 50;
  return 30;
}

export function isWonStage(stages: readonly PipelineStage[], target: string): boolean {
  return probabilityForStage(stages, target) === 100;
}
