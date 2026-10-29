"use client";

import { InvoicesView } from "@/components/dashboard/invoices-view";
import { InvoicesSkeleton } from "@/components/dashboard/skeletons";
import { useCrm } from "@/components/dashboard/crm-context";

export default function InvoicesPage() {
  const {
    load, invoices, cheques, customers, searchQuery, userProfile,
    createInvoiceRecord, createChequeRecord, updateCheque,
  } = useCrm();

  if (!load.invoices || !load.cheques || !load.customers) return <InvoicesSkeleton />;

  return (
    <InvoicesView
      invoices={invoices}
      cheques={cheques}
      customers={customers}
      searchQuery={searchQuery}
      companyName={userProfile?.companyName}
      onCreateInvoice={createInvoiceRecord}
      onCreateCheque={createChequeRecord}
      onUpdateChequeStatus={updateCheque}
    />
  );
}
