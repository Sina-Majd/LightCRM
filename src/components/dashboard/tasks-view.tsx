"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Plus,
  Clock,
  Mail,
  Phone,
  Video,
  FileText,
  Sparkles,
  Building2,
  Trash2,
  MoreHorizontal,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { CRMTask, DealPriority } from "@/data/dashboard-mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TasksViewProps {
  tasks: CRMTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: CRMTask) => void;
  onDeleteTask?: (taskId: string) => void;
}

const typeIcons = {
  call: Phone,
  email: Mail,
  meeting: Video,
  review: FileText,
};

const priorityBadges: Record<DealPriority, string> = {
  urgent: "text-rose-300 bg-rose-500/10 border-rose-500/30",
  high: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  medium: "text-cyan-300 bg-cyan-500/10 border-cyan-500/30",
  low: "text-zinc-400 bg-zinc-800 border-zinc-700",
};

export function TasksView({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}: TasksViewProps) {
  const [filterTab, setFilterTab] = useState<string>("all");
  const [newTitle, setNewTitle] = useState("");
  const [newRelated, setNewRelated] = useState("");
  const [newType, setNewType] = useState<"call" | "email" | "meeting" | "review">("email");
  const [newPriority, setNewPriority] = useState<DealPriority>("high");


  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: CRMTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      dueDate: "Today at 5:00 PM",
      dueCategory: "today",
      priority: newPriority,
      completed: false,
      relatedTo: newRelated.trim() || "General Workflow",
      relatedType: "deal",
    };

    onAddTask(newTask);
    toast.success("Task Created", {
      description: `"${newTask.title}" added to agenda.`,
      icon: <CheckCircle2 className="h-4 w-4 text-cyan-400" />,
    });
    setNewTitle("");
    setNewRelated("");
  };

  // Filter tasks with guaranteed unique IDs
  const filteredTasks = React.useMemo(() => {
    const seen = new Set<string>();
    return tasks.filter((t) => {
      if (!t || !t.id || seen.has(t.id)) return false;
      seen.add(t.id);

      if (filterTab === "pending") return !t.completed;
      if (filterTab === "completed") return t.completed;
      if (filterTab === "urgent") return !t.completed && (t.priority === "urgent" || t.priority === "high");
      return true;
    });
  }, [tasks, filterTab]);

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Quick Add Task Strip */}
      <Card className="bg-[#111117] border-white/[0.08] shadow-lg">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Quick Add Follow-Up or Action Item</span>
          </div>

          <form onSubmit={handleCreateTask} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-6">
              <Input
                placeholder="e.g. Call Marcus Chen regarding Q3 pricing proposal..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="h-10 text-xs bg-black/40 border-white/10"
              />
            </div>

            <div className="sm:col-span-3">
              <Input
                placeholder="Related Deal or Client..."
                value={newRelated}
                onChange={(e) => setNewRelated(e.target.value)}
                className="h-10 text-xs bg-black/40 border-white/10"
              />
            </div>

            <div className="sm:col-span-3 flex items-center gap-2">
              <div className="flex-1">
                <Select
                  value={newType}
                  onValueChange={(v) =>
                    setNewType(v as "call" | "email" | "meeting" | "review")
                  }
                >
                  <SelectTrigger className="h-10 text-xs">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="call">Phone Call</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="review">Contract Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                size="sm"
                className="h-10 px-4 text-xs bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Filter Tabs Strip using Shadcn Tabs */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#111117] p-3">
        <Tabs value={filterTab} onValueChange={setFilterTab} className="w-auto">
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">
              All ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs text-cyan-400">
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="urgent" className="text-xs text-rose-400">
              Urgent & High
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs text-emerald-400">
              Completed ({completedCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
          {pendingCount} tasks remaining
        </span>
      </div>

      {/* Task List Section */}
      <Card className="bg-[#0f0f16] border-white/[0.08] shadow-lg">
        <CardHeader className="pb-3 border-b border-white/[0.06] flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            <CardTitle className="text-sm font-bold text-white">
              Agenda & Follow-Up Items
            </CardTitle>
            <Badge
              variant="outline"
              className="bg-cyan-500/10 border-cyan-500/20 text-[10px] font-mono text-cyan-300 py-0.5 px-2"
            >
              {filteredTasks.length} items
            </Badge>
          </div>

          <span className="text-xs font-mono text-zinc-500">
            Check box to mark completed
          </span>
        </CardHeader>

        <CardContent className="p-5 space-y-2.5">
          {filteredTasks.map((task) => {
            const Icon = typeIcons[task.type] || Clock;
            const priBadge = priorityBadges[task.priority];

            return (
              <div
                key={task.id}
                className={`group flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                  task.completed
                    ? "border-white/[0.04] bg-black/20 text-zinc-400 opacity-60 hover:opacity-100"
                    : "border-white/[0.06] bg-[#14141d] hover:border-cyan-500/30 hover:bg-[#181826]"
                }`}
              >
                {/* Left: Checkbox + Type Icon + Title */}
                <div className="flex items-center gap-3 min-w-0">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => onToggleTask(task.id)}
                    className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />

                  <div className="h-8 w-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400 group-hover:text-cyan-300 shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <div
                      className={`text-xs font-medium truncate transition-colors ${
                        task.completed
                          ? "line-through text-zinc-500"
                          : "text-white group-hover:text-cyan-200"
                      }`}
                    >
                      {task.title}
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-zinc-500" />
                        <span className="text-zinc-300">{task.relatedTo}</span>
                      </span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-zinc-500 font-mono">{task.dueDate}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Priority Badge + Quick Action Buttons + Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono py-0.5 px-2 capitalize ${priBadge}`}
                  >
                    {task.priority}
                  </Badge>

                  {/* Task Context Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-zinc-500 hover:text-white hover:bg-white/[0.06] cursor-pointer"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 bg-[#12121c] border-white/10 text-zinc-100 p-1 shadow-2xl"
                    >
                      <DropdownMenuLabel className="text-[10px] font-mono uppercase text-zinc-500">
                        Task Actions
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => onToggleTask(task.id)}
                        className="text-xs cursor-pointer flex items-center gap-2"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{task.completed ? "Mark as Pending" : "Mark as Completed"}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          toast.info("Task Rescheduled", {
                            description: `"${task.title}" rescheduled for tomorrow.`,
                            icon: <Calendar className="h-3.5 w-3.5 text-cyan-400" />,
                          })
                        }
                        className="text-xs cursor-pointer flex items-center gap-2"
                      >
                        <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Reschedule Tomorrow</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      {onDeleteTask && (
                        <DropdownMenuItem
                          onClick={() => {
                            onDeleteTask(task.id);
                            toast.info("Task Removed", {
                              description: "Task removed from agenda.",
                              icon: <Trash2 className="h-3.5 w-3.5 text-zinc-400" />,
                            });
                          }}
                          className="text-xs cursor-pointer flex items-center gap-2 text-red-400 focus:text-red-300 focus:bg-red-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete Task</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}

          {filteredTasks.length === 0 && (
            <div className="py-12 text-center text-zinc-500 text-xs">
              No tasks found in this view.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
