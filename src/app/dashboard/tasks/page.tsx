"use client";

import { TasksView } from "@/components/dashboard/tasks-view";
import { TasksSkeleton } from "@/components/dashboard/skeletons";
import { useCrm } from "@/components/dashboard/crm-context";

export default function TasksPage() {
  const { load, tasks, toggleTaskDone, rescheduleTask, addTask, deleteTask } = useCrm();

  if (!load.tasks) return <TasksSkeleton />;

  return (
    <TasksView
      tasks={tasks}
      onToggleTask={toggleTaskDone}
      onRescheduleTask={rescheduleTask}
      onAddTask={addTask}
      onDeleteTask={deleteTask}
    />
  );
}
