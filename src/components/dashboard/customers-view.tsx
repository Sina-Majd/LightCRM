"use client";

import React, { useState } from "react";
import {
  Building2,
  Mail,
  MapPin,
  ChevronRight,
  TrendingUp,
  Plus,
  UserPlus,
  MoreHorizontal,
  Trash2,
  FileText,
  PhoneCall,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { Customer, CustomerTier, CustomerHealth } from "@/data/dashboard-mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomersViewProps {
  customers: Customer[];
  searchQuery: string;
  onSelectCustomer?: (customer: Customer) => void;
  onOpenNewCustomerModal?: () => void;
  onDeleteCustomer?: (customerId: string) => void;
  onAddOpportunityForCustomer?: (customer: Customer) => void;
}

const tierConfig: Record<CustomerTier, { badge: string }> = {
  Enterprise: {
    badge: "border-purple-500/40 text-purple-300 bg-purple-500/10 shadow-[0_0_12px_rgba(168,85,247,0.15)]",
  },
  Growth: {
    badge: "border-cyan-500/30 text-cyan-300 bg-cyan-500/10",
  },
  Startup: {
    badge: "border-blue-500/30 text-blue-300 bg-blue-500/10",
  },
};

const healthConfig: Record<
  CustomerHealth,
  { label: string; text: string; dot: string }
> = {
  excellent: {
    label: "Excellent",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  good: {
    label: "Good",
    text: "text-cyan-400",
    dot: "bg-cyan-400",
  },
  warning: {
    label: "Needs Attention",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  critical: {
    label: "At Risk",
    text: "text-rose-400",
    dot: "bg-rose-400 animate-pulse",
  },
};

export function CustomersView({
  customers,
  searchQuery,
  onSelectCustomer,
  onOpenNewCustomerModal,
  onDeleteCustomer,
  onAddOpportunityForCustomer,
}: CustomersViewProps) {
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);


  const filteredCustomers = React.useMemo(() => {
    const seen = new Set<string>();
    return customers.filter((cust) => {
      if (!cust || !cust.id || seen.has(cust.id)) return false;
      seen.add(cust.id);

      const matchesSearch =
        cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cust.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cust.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cust.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier = tierFilter === "all" || cust.tier === tierFilter;

      return matchesSearch && matchesTier;
    });
  }, [customers, searchQuery, tierFilter]);

  const totalPortfolioLtv = customers.reduce((sum, c) => sum + c.ltv, 0);
  const avgHealth = Math.round(
    customers.reduce((sum, c) => sum + c.healthScore, 0) / (customers.length || 1)
  );

  return (
    <div className="space-y-4">

      {/* Portfolio Quick Summary Strip via Shadcn Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-[#111117] border-white/[0.08]">
          <CardContent className="p-4">
            <div className="text-[11px] font-mono text-zinc-500 uppercase">
              Total Portfolio LTV
            </div>
            <div className="mt-1 font-mono text-xl font-bold text-white">
              ${totalPortfolioLtv.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>+18.4% YoY expansion</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111117] border-white/[0.08]">
          <CardContent className="p-4">
            <div className="text-[11px] font-mono text-zinc-500 uppercase">
              Active Accounts
            </div>
            <div className="mt-1 font-mono text-xl font-bold text-white">
              {customers.length} Companies
            </div>
            <div className="mt-1 text-[11px] text-zinc-400">
              0% Churn rate this quarter
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111117] border-white/[0.08]">
          <CardContent className="p-4">
            <div className="text-[11px] font-mono text-zinc-500 uppercase">
              Average Health Score
            </div>
            <div className="mt-1 font-mono text-xl font-bold text-emerald-400">
              {avgHealth}%
            </div>
            <div className="mt-1 text-[11px] text-zinc-400">
              5 of 6 accounts in prime standing
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111117] border-white/[0.08]">
          <CardContent className="p-4">
            <div className="text-[11px] font-mono text-zinc-500 uppercase">
              Upcoming Renewals
            </div>
            <div className="mt-1 font-mono text-xl font-bold text-cyan-300">
              2 Accounts
            </div>
            <div className="mt-1 text-[11px] text-zinc-400">
              Due within next 60 days
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Selector & Quick Add Customer Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#111117] p-3">
        {/* Tier Filter Tabs with clean horizontal scrolling on narrow viewports */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar min-w-0">
          <span className="text-xs font-mono uppercase text-zinc-500 mr-1 shrink-0">
            Tier:
          </span>
          <Tabs value={tierFilter} onValueChange={setTierFilter} className="w-auto shrink-0">
            <TabsList className="h-9">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Enterprise" className="text-purple-400">
                Enterprise
              </TabsTrigger>
              <TabsTrigger value="Growth" className="text-cyan-400">
                Growth
              </TabsTrigger>
              <TabsTrigger value="Startup" className="text-blue-400">
                Startup
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Right Section: Counter + Add Customer Action Button */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
          <div className="text-xs text-zinc-400 font-mono">
            Showing {filteredCustomers.length} client profiles
          </div>

          {onOpenNewCustomerModal && (
            <Button
              size="sm"
              onClick={onOpenNewCustomerModal}
              className="h-8 px-3 text-xs bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer shrink-0"
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              <span>Add Customer</span>
            </Button>
          )}
        </div>
      </div>

      {/* Customer 360 Grid via Shadcn Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => {
          const tier = tierConfig[customer.tier];
          const health = healthConfig[customer.healthStatus];

          return (
            <Card
              key={customer.id}
              className="group bg-[#0f0f16] border-white/[0.08] hover:border-white/20 hover:bg-[#13131e] transition-all shadow-md flex flex-col justify-between"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-cyan-400 shrink-0">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {customer.company}
                      </CardTitle>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-zinc-500" />
                        <span className="truncate">{customer.location}</span>
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono py-0.5 px-2 ${tier.badge}`}
                  >
                    {customer.tier}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3">
                {/* Industry & Key Contact */}
                <div className="pt-2 border-t border-white/[0.06] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Key Contact</span>
                    <span className="font-medium text-zinc-200">
                      {customer.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Industry</span>
                    <span className="text-zinc-400">{customer.industry}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Account Health</span>
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className={`h-1.5 w-1.5 rounded-full ${health.dot}`} />
                      <span className={`font-semibold ${health.text}`}>
                        {customer.healthScore}% ({health.label})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics Box */}
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-black/40 border border-white/[0.04] p-3 text-xs">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      Lifetime Value
                    </div>
                    <div className="font-mono text-sm font-bold text-emerald-400 mt-0.5">
                      {customer.formattedLtv}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      Renewal Date
                    </div>
                    <div className="font-mono text-xs text-zinc-300 mt-0.5">
                      {customer.renewalDate}
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Bottom Card Actions via Shadcn Button and DropdownMenu */}
              <CardFooter className="p-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 font-mono">
                  Last touch: {customer.lastTouch}
                </span>

                <div className="flex items-center gap-1.5">
                  {/* View 360 Primary Action Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSelectCustomer?.(customer)}
                    className="h-7 px-2.5 text-[11px] font-medium bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-white rounded-lg transition-all cursor-pointer shadow-xs"
                  >
                    <span>View 360°</span>
                    <ChevronRight className="h-3 w-3 ml-0.5" />
                  </Button>

                  {/* Customer Quick Actions Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-52 bg-[#12121c] border-white/10 text-zinc-100 p-1 shadow-2xl"
                    >
                      <DropdownMenuLabel className="text-[10px] font-mono uppercase text-zinc-500">
                        Account Actions
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => onSelectCustomer?.(customer)}
                        className="text-xs cursor-pointer flex items-center gap-2 text-cyan-300"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span>View 360° Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onAddOpportunityForCustomer?.(customer)}
                        className="text-xs cursor-pointer flex items-center gap-2"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>New Opportunity</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => (window.location.href = `mailto:${customer.email}`)}
                        className="text-xs cursor-pointer flex items-center gap-2"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span>Compose Email</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          toast.success("Call Logged", {
                            description: `Call recorded for ${customer.name}.`,
                            icon: <Phone className="h-3.5 w-3.5 text-cyan-400" />,
                          })
                        }
                        className="text-xs cursor-pointer flex items-center gap-2"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span>Log Phone Call</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          toast.success("Invoice Generated", {
                            description: `Draft invoice generated for ${customer.company}.`,
                            icon: <FileText className="h-3.5 w-3.5 text-cyan-400" />,
                          })
                        }
                        className="text-xs cursor-pointer flex items-center gap-2"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Generate Invoice</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          toast.success("Touchpoint Logged", {
                            description: `Client touchpoint recorded for ${customer.company}.`,
                            icon: <PhoneCall className="h-3.5 w-3.5 text-cyan-400" />,
                          })
                        }
                        className="text-xs cursor-pointer flex items-center gap-2"
                      >
                        <PhoneCall className="h-3.5 w-3.5" />
                        <span>Log Client Touchpoint</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="bg-white/10" />

                      <DropdownMenuItem
                        onClick={() => setCustomerToDelete(customer)}
                        className="text-xs cursor-pointer flex items-center gap-2 text-red-400 focus:text-red-300 focus:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete Customer Account</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Confirmation Dialog for Customer Deletion */}
      <ConfirmDeleteDialog
        open={!!customerToDelete}
        onOpenChange={(open) => !open && setCustomerToDelete(null)}
        title="Delete Customer Account"
        itemName={customerToDelete ? `${customerToDelete.company} (${customerToDelete.name})` : undefined}
        description="Are you sure you want to delete this customer account? This will permanently remove their records, touchpoints, and history from your CRM."
        confirmLabel="Delete Customer"
        onConfirm={() => {
          if (customerToDelete) {
            onDeleteCustomer?.(customerToDelete.id);
            toast.info("Customer Removed", {
              description: `Account ${customerToDelete.company} removed from records.`,
              icon: <Trash2 className="h-3.5 w-3.5 text-zinc-400" />,
            });
            setCustomerToDelete(null);
          }
        }}
      />
    </div>
  );
}
