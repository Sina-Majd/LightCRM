"use client";

import { AnalyticsView } from "@/components/dashboard/analytics-view";
import { AnalyticsSkeleton } from "@/components/dashboard/skeletons";
import { useCrm } from "@/components/dashboard/crm-context";

export default function AnalyticsPage() {
  const { load, deals } = useCrm();

  if (!load.deals) return <AnalyticsSkeleton />;

  return <AnalyticsView deals={deals} />;
}