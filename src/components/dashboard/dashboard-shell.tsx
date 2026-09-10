"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Layers,
  Sparkles,
  Command,
  Settings,
  LogOut,
  HelpCircle,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Building2,
  Check,
  User,
} from "lucide-react";
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CRMNotification } from "@/data/dashboard-mock-data";
import { motion, AnimatePresence } from "framer-motion";

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
  counts,
  children,
}: DashboardShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState("Acme Global · Enterprise");
  const [userStatus, setUserStatus] = useState<"Available" | "Away" | "Do Not Disturb">("Available");

  const statusColorMap: Record<"Available" | "Away" | "Do Not Disturb", string> = {
    Available: "bg-emerald-400",
    Away: "bg-amber-400",
    "Do Not Disturb": "bg-red-500",
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const navItems: Array<{
    id: DashboardTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }> = [
    {
      id: "pipeline",
      label: "Deals & Pipeline",
      icon: Kanban,
      count: counts.deals,
    },
    {
      id: "leads",
      label: "Leads Intelligence",
      icon: Users,
      count: counts.leads,
    },
    {
      id: "customers",
      label: "Customer Directory",
      icon: UserCheck,
      count: counts.customers,
    },
    {
      id: "tasks",
      label: "Tasks & Agenda",
      icon: CheckSquare,
      count: counts.tasks,
    },
    {
      id: "analytics",
      label: "Analytics & Quota",
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
            <Badge variant="outline" className="text-[9px] font-mono py-0 px-1.5 border-cyan-500/30 text-cyan-300 bg-cyan-950/40">
              v2.4
            </Badge>
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
                onClick={() => setActiveWorkspace("Acme Global · Enterprise")}
                className="cursor-pointer text-xs flex items-center justify-between"
              >
                <span>Acme Global · Enterprise</span>
                {activeWorkspace.includes("Acme") && <Check className="h-3.5 w-3.5 text-cyan-400" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setActiveWorkspace("Solstice Studio · Pro")}
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
          {/* User Profile Tile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full h-auto flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.05] transition-colors cursor-pointer text-left font-normal"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar className="h-8 w-8 ring-1 ring-white/10 shadow-md shrink-0">
                    <AvatarFallback className="bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white">
                      <User className="h-4 w-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      Jane Doe
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
                Jane Doe (Head of Sales)
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => setUserStatus("Available")}
                className="text-xs cursor-pointer flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Set status: Available</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setUserStatus("Away")}
                className="text-xs cursor-pointer flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span>Set status: Away</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setUserStatus("Do Not Disturb")}
                className="text-xs cursor-pointer flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <span>Set status: Do Not Disturb</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                asChild
                className="text-xs cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10"
              >
                <Link href="/" className="flex items-center gap-2 w-full text-red-400 hover:text-red-300">
                  <LogOut className="h-3.5 w-3.5 text-red-400" />
                  <span>Sign out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Executive Header Bar */}
        <header className="sticky top-0 z-20 h-16 border-b border-white/[0.08] bg-[#09090e]/90 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile Nav Toggle + Search */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden h-9 w-9 p-0 rounded-lg border-white/10 text-zinc-400 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Global Search Bar with ⌘K Badge */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
              <Input
                placeholder="Search deals, leads, companies, or contacts..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-9 pl-9 pr-14 text-xs bg-white/[0.03] border-white/10 rounded-xl focus:border-cyan-500/50"
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
          </div>

          {/* Right: Quick Action Controls + Notifications */}
          <div className="flex items-center gap-3">
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
                className="w-80 sm:w-96 bg-[#12121c] border-white/10 text-zinc-100 p-2 shadow-2xl"
              >
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/[0.06] mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-cyan-500/30 text-cyan-300">
                      {unreadNotifications} new
                    </Badge>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-mono">Live updates</span>
                </div>

                <div className="space-y-1 max-h-72 overflow-y-auto py-1">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationRead?.(notif.id)}
                      className={`p-2.5 rounded-lg transition-colors cursor-pointer ${
                        notif.read
                          ? "hover:bg-white/[0.03] opacity-60"
                          : "bg-cyan-500/[0.08] border border-cyan-500/20"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-white mb-0.5">
                        <span className="truncate">{notif.title}</span>
                        <span className="text-[10px] font-mono text-zinc-500 shrink-0 ml-2">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-snug">
                        {notif.description}
                      </p>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Back to Public Site Link */}
            <Link
              href="/"
              className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.04] transition-colors"
            >
              <span>Website</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            {/* Direct "+ Create" Button */}
            <Button
              size="sm"
              onClick={onOpenNewDealModal}
              className="h-9 px-3 text-xs bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950/40 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span className="hidden sm:inline">New Record</span>
            </Button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="left" className="bg-[#0c0c14] border-white/10 text-zinc-100 p-4">
            <SheetHeader className="mb-4 text-left">
              <LightCrmLogo size="sm" />
              <SheetTitle className="text-sm font-bold text-zinc-400 mt-2">
                Navigation
              </SheetTitle>
            </SheetHeader>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onTabChange(item.id);
                      setMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-300 font-bold"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className="text-[10px] font-mono">{item.count}</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Responsive Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
