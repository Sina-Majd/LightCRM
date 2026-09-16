"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Kanban,
  Users,
  UserCheck,
  CheckSquare,
  BarChart3,
  Search,
  Bell,
  Plus,
  ChevronDown,
  Command,
  LogOut,
  Building2,
  Check,
  User,
  Briefcase,
  CreditCard,
  CheckCheck,
} from "lucide-react";
import { formatNotificationTime, formatFullTimestamp } from "@/lib/date-utils";
import { LightCrmLogo } from "@/components/lightcrm-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { CRMNotification } from "@/data/dashboard-mock-data";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { UserProfile, updateUserStatus } from "@/lib/supabase/crm-service";
import { useRouter } from "next/navigation";

export type DashboardTab =
  | "pipeline"
  | "leads"
  | "customers"
  | "tasks"
  | "analytics";

interface DashboardShellProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenNewDealModal: () => void;
  onOpenCommandMenu?: () => void;
  notifications: CRMNotification[];
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllNotificationsRead?: () => void;
  userProfile?: UserProfile | null;
  counts: {
    deals: number;
    leads: number;
    customers: number;
    tasks: number;
  };
  children: React.ReactNode;
}

export function DashboardShell({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onOpenNewDealModal,
  onOpenCommandMenu,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  userProfile,
  counts,
  children,
}: DashboardShellProps) {
  const router = useRouter();
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);
  const [userStatus, setUserStatus] = useState<"Available" | "Away" | "Do Not Disturb">(
    userProfile?.status || "Available"
  );
  const [customWorkspace, setCustomWorkspace] = useState<string | null>(null);

  // Live ticker to refresh relative time strings every 30 seconds
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const getNotificationIcon = (type: CRMNotification["type"]) => {
    switch (type) {
      case "deal":
        return <Briefcase className="h-3.5 w-3.5 text-emerald-400" />;
      case "lead":
        return <UserCheck className="h-3.5 w-3.5 text-purple-400" />;
      case "customer":
        return <Building2 className="h-3.5 w-3.5 text-cyan-400" />;
      case "payment":
        return <CreditCard className="h-3.5 w-3.5 text-amber-400" />;
      case "system":
      default:
        return <Bell className="h-3.5 w-3.5 text-zinc-400" />;
    }
  };

  const activeWorkspace =
    customWorkspace ||
    (userProfile?.companyName
      ? `${userProfile.companyName} · ${userProfile.plan.toUpperCase()}`
      : "Acme Global · Enterprise");

  const handleStatusChange = (status: "Available" | "Away" | "Do Not Disturb") => {
    setUserStatus(status);
    toast.success("Status Updated", {
      description: `Your status is now ${status}.`,
    });
    if (userProfile?.id) {
      updateUserStatus(userProfile.id, status);
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    } finally {
      router.push("/login");
    }
  };

  const statusColorMap: Record<"Available" | "Away" | "Do Not Disturb", string> = {
    Available: "bg-emerald-400",
    Away: "bg-amber-400",
    "Do Not Disturb": "bg-red-500",
  };

  const uniqueNotifications = React.useMemo(() => {
    const seen = new Set<string>();
    return notifications.filter((n) => {
      if (!n || !n.id || seen.has(n.id)) return false;
      seen.add(n.id);
      return true;
    });
  }, [notifications]);

  const unreadNotifications = uniqueNotifications.filter((n) => !n.read).length;

  const navItems: Array<{
    id: DashboardTab;
    label: string;
    shortLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }> = [
    {
      id: "pipeline",
      label: "Deals & Pipeline",
      shortLabel: "Pipeline",
      icon: Kanban,
      count: counts.deals,
    },
    {
      id: "leads",
      label: "Leads Intelligence",
      shortLabel: "Leads",
      icon: Users,
      count: counts.leads,
    },
    {
      id: "customers",
      label: "Customer Directory",
      shortLabel: "Customers",
      icon: UserCheck,
      count: counts.customers,
    },
    {
      id: "tasks",
      label: "Tasks & Agenda",
      shortLabel: "Tasks",
      icon: CheckSquare,
      count: counts.tasks,
    },
    {
      id: "analytics",
      label: "Analytics & Quota",
      shortLabel: "Analytics",
      icon: BarChart3,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#08080c] text-zinc-100 flex flex-col md:flex-row antialiased selection:bg-cyan-500/30 selection:text-white">
      {/* Background Blueprint Grid */}
      <div className="absolute inset-0 bg-circuit-grid opacity-50 pointer-events-none -z-10" />

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/[0.08] bg-[#0c0c13]/95 backdrop-blur-2xl shrink-0 z-30">
        {/* Workspace Switcher Header */}
        <div className="p-4 border-b border-white/[0.08]">
          <Link href="/" className="flex items-center gap-2 mb-4 group">
            <LightCrmLogo size="sm" />
          </Link>

          {/* Workspace Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-auto flex items-center justify-between p-2 rounded-xl border-white/[0.08] bg-black/40 hover:bg-white/[0.04] text-left cursor-pointer font-normal"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="h-7 w-7 rounded-lg ring-1 ring-white/10 shrink-0">
                    <AvatarFallback className="rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white">
                      <Building2 className="h-3.5 w-3.5 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {activeWorkspace}
                    </div>
                    <div className="text-[10px] text-zinc-400">Team Workspace</div>
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#12121c] border-white/10 text-zinc-100">
              <DropdownMenuLabel className="text-[10px] font-mono uppercase text-zinc-500">
                Switch Organization
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => setCustomWorkspace("Acme Global · Enterprise")}
                className="cursor-pointer text-xs flex items-center justify-between"
              >
                <span>Acme Global · Enterprise</span>
                {activeWorkspace.includes("Acme") && <Check className="h-3.5 w-3.5 text-cyan-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setCustomWorkspace("Solstice Studio · Pro")}
                className="cursor-pointer text-xs flex items-center justify-between"
              >
                <span>Solstice Studio · Pro</span>
                {activeWorkspace.includes("Solstice") && <Check className="h-3.5 w-3.5 text-cyan-400" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="cursor-pointer text-xs text-cyan-400">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Create New Workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Quick Action Button */}
        <div className="p-3">
          <Button
            onClick={onOpenNewDealModal}
            className="w-full h-9 text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-950/50 cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Create Opportunity</span>
          </Button>
        </div>

        {/* Primary Navigation Menu */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-3 py-1">
            CRM Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "text-white bg-white/[0.08] shadow-sm font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? "text-cyan-400" : "text-zinc-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && (
                  <span
                    className={`rounded-md px-1.5 py-0.2 text-[10px] font-mono ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-300 font-bold"
                        : "bg-white/[0.05] text-zinc-400"
                    }`}
                  >
                    {item.count}
                  </span>
                )}

                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-cyan-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: User Status */}
        <div className="p-3 border-t border-white/[0.08] bg-black/20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full h-auto flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer text-left font-normal"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar className="h-8 w-8 ring-1 ring-white/10 shadow-md shrink-0">
                    <AvatarFallback className="bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white">
                      <User className="h-4 w-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      {userProfile?.fullName || "Alex Rivera"}
                    </div>
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${statusColorMap[userStatus]}`} />
                      <span>{userStatus}</span>
                    </div>
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#12121c] border-white/10 text-zinc-100 mb-2">
              <DropdownMenuLabel className="text-xs font-semibold">
                {userProfile?.fullName || "Alex Rivera"} ({userProfile?.role || "Head of Sales"})
              </DropdownMenuLabel>
              <div className="px-2 py-1 text-[10px] text-zinc-400 truncate">
                {userProfile?.email || "demo@lightcrm.io"}
              </div>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => handleStatusChange("Available")}
                className="text-xs cursor-pointer flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Set status: Available</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("Away")}
                className="text-xs cursor-pointer flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span>Set status: Away</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("Do Not Disturb")}
                className="text-xs cursor-pointer flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <span>Set status: Do Not Disturb</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-xs cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10 flex items-center gap-2"
              >
                <LogOut className="h-3.5 w-3.5 text-red-400" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Executive Header Bar */}
        <header className="sticky top-0 z-20 h-16 border-b border-white/[0.08] bg-[#09090e]/90 backdrop-blur-xl px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* Mobile Logo Brand */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <LightCrmLogo size="sm" />
            </Link>
          </div>

          {/* Search Bar with ⌘K Badge */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            <Input
              placeholder="Search CRM..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9 pl-9 pr-10 sm:pr-14 text-xs bg-white/[0.03] border-white/10 rounded-xl focus:border-cyan-500/50 w-full"
            />
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={onOpenCommandMenu}
              className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex h-5 items-center gap-1 rounded bg-white/[0.08] px-1.5 py-0 text-[10px] font-mono text-zinc-400 hover:text-white cursor-pointer"
            >
              <Command className="h-3 w-3" />
              <span>K</span>
            </Button>
          </div>

          {/* Right Controls: Notifications, Quick Create & Mobile Profile Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Notification Center Popover */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  className="relative h-9 w-9 p-0 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Bell className="h-4 w-4" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-cyan-500 text-[9px] font-bold text-black flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 sm:w-96 bg-[#12121c] border-white/10 text-zinc-100 p-2.5 shadow-2xl"
              >
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/[0.06] mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadNotifications > 0 && onMarkAllNotificationsRead && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAllNotificationsRead();
                        }}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <CheckCheck className="h-3 w-3" />
                        <span>Mark all read</span>
                      </button>
                    )}
                    <span className="text-[10px] text-zinc-500 font-mono">Live updates</span>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto py-1 pr-0.5">
                  {uniqueNotifications.length === 0 ? (
                    <div className="py-8 text-center text-zinc-500 flex flex-col items-center justify-center gap-1.5">
                      <Bell className="h-5 w-5 text-zinc-600 opacity-60" />
                      <span className="text-xs text-zinc-400">No notifications yet</span>
                      <span className="text-[10px] text-zinc-600">Activity will appear here in real-time</span>
                    </div>
                  ) : (
                    uniqueNotifications.map((notif) => {
                      const displayTime = formatNotificationTime(notif.createdAt, notif.time);
                      const fullTime = formatFullTimestamp(notif.createdAt);

                      return (
                        <div
                          key={notif.id}
                          onClick={() => onMarkNotificationRead?.(notif.id)}
                          className={`p-2.5 rounded-lg transition-colors cursor-pointer relative ${
                            notif.read
                              ? "hover:bg-white/[0.03] opacity-60"
                              : "bg-cyan-500/[0.08] border border-cyan-500/20 hover:bg-cyan-500/[0.12]"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 shrink-0 h-6 w-6 rounded-md bg-white/[0.04] flex items-center justify-center border border-white/[0.08]">
                              {getNotificationIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="text-xs font-semibold text-white truncate">
                                  {notif.title}
                                </span>
                                <span
                                  title={fullTime || displayTime}
                                  className="text-[10px] font-mono text-zinc-400 shrink-0 ml-1.5"
                                >
                                  {displayTime}
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-300 leading-snug break-words">
                                {notif.description}
                              </p>
                            </div>
                            {!notif.read && (
                              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0 mt-1" />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick "+ Create" Button - perfectly aligned with Bell & Avatar */}
            <Button
              size="sm"
              onClick={onOpenNewDealModal}
              className="h-9 w-9 sm:w-auto p-0 sm:px-3 text-xs bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950/40 rounded-xl cursor-pointer shrink-0 flex items-center justify-center"
            >
              <Plus className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">New Record</span>
            </Button>

            {/* Mobile User Profile Avatar Trigger - harmonized 36px rounded-xl */}
            <button
              type="button"
              onClick={() => setAccountDrawerOpen(true)}
              className="md:hidden relative h-9 w-9 rounded-xl shrink-0 p-0 flex items-center justify-center ring-1 ring-white/10 hover:ring-cyan-500/40 focus:outline-none transition-all cursor-pointer overflow-visible"
              aria-label="Open user profile and account options"
            >
              <Avatar className="h-9 w-9 rounded-xl">
                <AvatarFallback className="rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#09090e] ${statusColorMap[userStatus]}`}
              />
            </button>
          </div>
        </header>

        {/* Mobile Account & Workspace Drawer (Full Profile Info & Sign Out) */}
        <Sheet open={accountDrawerOpen} onOpenChange={setAccountDrawerOpen}>
          <SheetContent
            side="bottom"
            className="md:hidden bg-[#0e0e17] border-t border-white/10 text-zinc-100 pt-8 pb-6 px-5 rounded-t-3xl max-h-[85vh] overflow-y-auto"
          >
            {/* Top Sheet Drag Indicator */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-5" />

            {/* User Profile Header Card - positioned with generous clearance from the top X button */}
            <div className="mt-2 flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <div className="relative">
                <Avatar className="h-12 w-12 rounded-xl ring-1 ring-white/15">
                  <AvatarFallback className="rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </AvatarFallback>
                </Avatar>
                <span
                  className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#0e0e17] ${statusColorMap[userStatus]}`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white truncate">
                    {userProfile?.fullName || "Alex Rivera"}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-[9px] font-mono py-0 px-1.5 border-cyan-500/30 text-cyan-300 bg-cyan-950/40 shrink-0"
                  >
                    {userProfile?.plan?.toUpperCase() || "ENTERPRISE"}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400 truncate mt-0.5">
                  {userProfile?.email || "demo@lightcrm.io"}
                </p>
                <p className="text-[11px] text-zinc-500 font-medium">
                  {userProfile?.role || "Head of Sales"} · {userProfile?.companyName || "Acme Global"}
                </p>
              </div>
            </div>

            {/* Live Status Selector */}
            <div className="mt-4">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-2 px-1">
                Availability Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Available", "Away", "Do Not Disturb"] as const).map((status) => {
                  const isSelected = userStatus === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleStatusChange(status)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-white/[0.08] border-cyan-500/50 text-white shadow-sm"
                          : "bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${statusColorMap[status]}`} />
                      <span className="truncate">{status === "Do Not Disturb" ? "DND" : status}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Organization / Workspace Switcher */}
            <div className="mt-4">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-2 px-1">
                Active Organization
              </label>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setCustomWorkspace("Acme Global · Enterprise");
                    toast.success("Workspace switched to Acme Global");
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-colors ${
                    activeWorkspace.includes("Acme")
                      ? "bg-cyan-500/10 border-cyan-500/30 text-white font-medium"
                      : "bg-white/[0.02] border-white/[0.06] text-zinc-400"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="h-4 w-4 text-cyan-400" />
                    <span>Acme Global (Enterprise)</span>
                  </div>
                  {activeWorkspace.includes("Acme") && (
                    <Check className="h-4 w-4 text-cyan-400" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCustomWorkspace("Solstice Studio · Pro");
                    toast.success("Workspace switched to Solstice Studio");
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-colors ${
                    activeWorkspace.includes("Solstice")
                      ? "bg-cyan-500/10 border-cyan-500/30 text-white font-medium"
                      : "bg-white/[0.02] border-white/[0.06] text-zinc-400"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="h-4 w-4 text-indigo-400" />
                    <span>Solstice Studio (Pro)</span>
                  </div>
                  {activeWorkspace.includes("Solstice") && (
                    <Check className="h-4 w-4 text-cyan-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Quick Workspace Stats */}
            <div className="mt-4 grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-black/30 border border-white/[0.06]">
              <div>
                <div className="text-[10px] text-zinc-500 font-mono uppercase">Deals</div>
                <div className="text-sm font-bold text-white mt-0.5">{counts.deals}</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 font-mono uppercase">Leads</div>
                <div className="text-sm font-bold text-cyan-300 mt-0.5">{counts.leads}</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 font-mono uppercase">Clients</div>
                <div className="text-sm font-bold text-indigo-300 mt-0.5">{counts.customers}</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 font-mono uppercase">Tasks</div>
                <div className="text-sm font-bold text-amber-300 mt-0.5">{counts.tasks}</div>
              </div>
            </div>

            {/* Sign Out Action Button */}
            <div className="mt-6 pt-4 border-t border-white/[0.08]">
              <Button
                variant="outline"
                type="button"
                onClick={handleSignOut}
                className="w-full h-11 rounded-xl border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <LogOut className="h-4 w-4 text-red-400" />
                <span>Sign out of LightCRM</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Responsive Content Workspace - with mobile bottom padding for navigation bar */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto">
          {children}
        </main>

        {/* Native Mobile Bottom Navigation Bar - Modern Full-Depth Glass Dock */}
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090f]/95 backdrop-blur-2xl border-t border-white/[0.08] px-2 py-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] flex items-center justify-around shadow-[0_-8px_32px_rgba(0,0,0,0.8)]"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className="relative flex flex-col items-center justify-center py-2 px-1 flex-1 rounded-xl cursor-pointer select-none transition-all group"
              >
                {/* Modern Full Illuminated Glass Tile Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="mobileNavActiveFullTile"
                    className="absolute inset-0 rounded-xl bg-gradient-to-b from-cyan-500/[0.18] via-cyan-500/[0.08] to-transparent border border-cyan-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_20px_rgba(6,182,212,0.18)]"
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    {/* Micro Specular Top Glow Beam */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                  </motion.div>
                )}

                {/* Icon */}
                <div className="relative z-10 flex items-center justify-center">
                  <Icon
                    className={`h-5 w-5 transition-all duration-200 ${
                      isActive
                        ? "text-cyan-300 scale-105 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                        : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  />
                </div>

                {/* Short Label */}
                <span
                  className={`relative z-10 text-[10px] tracking-tight mt-1 transition-colors ${
                    isActive
                      ? "font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                      : "font-normal text-zinc-400 group-hover:text-zinc-200"
                  }`}
                >
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

