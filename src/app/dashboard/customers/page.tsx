"use client";

import { CustomersView } from "@/components/dashboard/customers-view";
import { CustomersSkeleton } from "@/components/dashboard/skeletons";
import { useCrm } from "@/components/dashboard/crm-context";

export default function CustomersPage() {
  const {
    load, customers, deals, searchQuery,
    openCreateRecord, deleteCustomer, openDeal, navigate,
  } = useCrm();

  if (!load.customers) return <CustomersSkeleton />;

  return (
    <CustomersView
      customers={customers}
      searchQuery={searchQuery}
      onOpenNewCustomerModal={() => openCreateRecord("customer")}
      onDeleteCustomer={deleteCustomer}
      onAddOpportunityForCustomer={() => openCreateRecord("deal")}
      onOpenInvoiceForCustomer={() => navigate("invoices")}
      onSelectCustomer={(cust) => {
        const matched = deals.find(
          (d) => d.company.toLowerCase() === cust.company.toLowerCase()
        );
        if (matched) openDeal(matched);
        else openCreateRecord("deal");
      }}
    />
  );
}