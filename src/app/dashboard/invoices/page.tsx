"use client";

import { InvoicesView } from "@/components/dashboard/invoices-view";
import { InvoicesSkeleton } from "@/components/dashboard/skeletons";
import { useCrm } from "@/components/dashboard/crm-context";

export default function InvoicesPage() {
  const {
    load, invoices, cheques, customers, searchQuery,
    createInvoiceRecord, createChequeRecord, updateCheque,
  } = useCrm();

  if (!load.invoices || !load.cheques) return <InvoicesSkeleton />;

  return (
    <InvoicesView
      invoices={invoices}
      cheques={cheques}
      customers={customers}
      searchQuery={searchQuery}
      onCreateInvoice={createInvoiceRecord}
      onCreateCheque={createChequeRecord}
      onUpdateChequeStatus={updateCheque}
    />
  );
}