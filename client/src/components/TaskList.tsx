import { Task, TaskStatus } from "../types/actionCenter";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  isUpdatingTaskId?: string | null;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
}

export function TaskList({ tasks, isUpdatingTaskId, onUpdateStatus }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
        <h2 className="text-lg font-semibold text-slate-950">No tasks yet</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          This student currently has no action items assigned.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4" aria-label="Task list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isUpdating={isUpdatingTaskId === task.id}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </section>
  );
}
