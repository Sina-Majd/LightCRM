"use client";

import { AnalyticsView } from "@/components/dashboard/analytics-view";
import { AnalyticsSkeleton } from "@/components/dashboard/skeletons";
import { useCrm } from "@/components/dashboard/crm-context";

export default function AnalyticsPage() {
  const { load, deals, stages, invoices } = useCrm();

  if (!load.deals || !load.stages || !load.invoices) return <AnalyticsSkeleton />;

  return <AnalyticsView deals={deals} stages={stages} invoices={invoices} />;
}