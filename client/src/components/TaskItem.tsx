import { useEffect, useState } from "react";
import { Task, TaskStatus } from "../types/actionCenter";

interface TaskItemProps {
  task: Task;
  isUpdating: boolean;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
}

const statusLabels: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
};

const displayStatusLabels: Record<Task["status"], string> = {
  todo: "To do",
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
};

const statusStyles: Record<Task["status"], string> = {
  todo: "bg-amber-100 text-amber-950",
  pending: "bg-slate-100 text-slate-700",
  in_progress: "bg-sky-100 text-sky-900",
  completed: "bg-emerald-100 text-emerald-900",
};

function toEditableStatus(status: Task["status"]): TaskStatus {
  return status === "todo" ? "pending" : status;
}

export function TaskItem({ task, isUpdating, onUpdateStatus }: TaskItemProps) {
  const currentEditableStatus = toEditableStatus(task.status);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(currentEditableStatus);

  useEffect(() => {
    setSelectedStatus(toEditableStatus(task.status));
  }, [task.status]);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-glow">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`}>
              {displayStatusLabels[task.status]}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              Priority: {task.priority}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-950">{task.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p>
          </div>
          <p className="text-sm font-medium text-slate-500">
            Due {new Date(task.dueDate).toLocaleDateString()} · Updated {new Date(task.updatedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:min-w-56">
          <label className="text-sm font-semibold text-slate-700" htmlFor={`task-status-${task.id}`}>
            Update status
          </label>
          <select
            id={`task-status-${task.id}`}
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value as TaskStatus)}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            type="button"
            onClick={() => onUpdateStatus(task.id, selectedStatus)}
            disabled={isUpdating || selectedStatus === currentEditableStatus}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isUpdating ? "Updating..." : "Save change"}
          </button>
        </div>
      </div>
    </article>
  );
}
