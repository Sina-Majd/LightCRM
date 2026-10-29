"use client";

import { CustomersView } from "@/components/dashboard/customers-view";
import { CustomersSkeleton } from "@/components/dashboard/skeletons";
import { useCrm } from "@/components/dashboard/crm-context";

export default function CustomersPage() {
  const {
    load, customers, searchQuery,
    openCreateRecord, deleteCustomer, navigate,
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
    />
  );
}
