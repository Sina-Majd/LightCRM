"use client";

import { PipelineBoard } from "@/components/dashboard/pipeline-board";
import { PipelineSkeleton } from "@/components/dashboard/skeletons";
import { useCrm } from "@/components/dashboard/crm-context";

export default function PipelinePage() {
  const {
    load, stages, deals, searchQuery,
    changeDeals, openDeal, openCreateRecord, deleteDeal,
  } = useCrm();

  if (!load.deals || !load.stages) return <PipelineSkeleton />;

  return (
    <PipelineBoard
      stages={stages}
      deals={deals}
      onDealsChange={changeDeals}
      onSelectDeal={openDeal}
      onOpenNewDealModal={(stageId) => openCreateRecord("deal", stageId)}
      onDeleteDeal={deleteDeal}
      onOpenQuickCall={(d) => openDeal(d)}
      searchQuery={searchQuery}
    />
  );
}