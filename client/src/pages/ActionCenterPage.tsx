import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StudentSummaryCard } from "../components/StudentSummaryCard";
import { TaskList } from "../components/TaskList";
import { UnreadMessagesCard } from "../components/UnreadMessagesCard";
import { UrgencyBadge } from "../components/UrgencyBadge";
import {
  fetchActionCenter,
  fetchStudents,
  markMessageAsRead,
  updateTaskStatus,
} from "../api/actionCenter";
import { ActionCenterResponse, StudentSummary, TaskStatus } from "../types/actionCenter";
import { useState } from "react";

const DEMO_STUDENT_ID = "stu_001";

function updateCachedTask(
  current: ActionCenterResponse | undefined,
  taskId: string,
  status: TaskStatus,
) {
  if (!current) {
    return current;
  }

  return {
    ...current,
    tasks: current.tasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
  };
}

export function ActionCenterPage() {
  const queryClient = useQueryClient();
  const [selectedStudentId, setSelectedStudentId] = useState(DEMO_STUDENT_ID);

  const studentsQuery = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  const actionCenterQuery = useQuery({
    queryKey: ["action-center", selectedStudentId],
    queryFn: () => fetchActionCenter(selectedStudentId),
  });

  const taskMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      updateTaskStatus(taskId, status),
    onSuccess: ({ task }) => {
      queryClient.setQueryData<ActionCenterResponse>(["action-center", selectedStudentId], (current) =>
        updateCachedTask(current, task.id, task.status),
      );
      queryClient.invalidateQueries({ queryKey: ["action-center", selectedStudentId] });
    },
  });

  const unreadMutation = useMutation({
    mutationFn: ({ studentId, messageId }: { studentId: string; messageId: string }) =>
      markMessageAsRead(studentId, messageId),
    onSuccess: (updatedActionCenter) => {
      queryClient.setQueryData<ActionCenterResponse>(["action-center", selectedStudentId], updatedActionCenter);
      queryClient.invalidateQueries({ queryKey: ["action-center", selectedStudentId] });
    },
  });

  const handleUpdateStatus = (taskId: string, status: TaskStatus) => {
    taskMutation.mutate({ taskId, status });
  };

  if (actionCenterQuery.isLoading) {
    return <LoadingState />;
  }

  if (actionCenterQuery.isError) {
    return (
      <ErrorState
        message={actionCenterQuery.error.message}
        onRetry={() => actionCenterQuery.refetch()}
      />
    );
  }

  const data = actionCenterQuery.data;

  if (!data) {
    return <ErrorState message="No action center data was returned for this student." />;
  }

  const students: StudentSummary[] = studentsQuery.data?.students ?? [data.student];

  return (
    <main className="space-y-6">
      <section className="rounded-3xl bg-white/85 p-5 shadow-glow ring-1 ring-slate-200/80 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Student</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Switch student</h2>
          </div>

          <label className="w-full sm:w-96" htmlFor="student-selector">
            <span className="sr-only">Select student</span>
            <select
              id="student-selector"
              value={selectedStudentId}
              onChange={(event) => setSelectedStudentId(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} - Grade {student.grade} - {student.enrollmentStatus.replace("_", " ")}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <StudentSummaryCard student={data.student} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <UrgencyBadge urgency={data.urgency} />
        <UnreadMessagesCard
          count={data.unreadMessagesCount}
          messages={data.unreadMessages ?? []}
          isMarkingMessageId={unreadMutation.isPending ? unreadMutation.variables?.messageId ?? null : null}
          onMarkMessageAsRead={(messageId) => unreadMutation.mutate({ studentId: selectedStudentId, messageId })}
        />
        <div className="rounded-3xl bg-white/85 p-5 shadow-glow ring-1 ring-slate-200/80 backdrop-blur md:col-span-2 xl:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Action Center</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Review the student profile, monitor unread messages, and update task status as work gets completed.
          </p>
          {unreadMutation.isError ? (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-200">
              {unreadMutation.error.message}
            </p>
          ) : null}
          {taskMutation.isError ? (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-200">
              {taskMutation.error.message}
            </p>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Tasks</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Counselor follow-up items
          </h2>
        </div>
        <TaskList
          tasks={data.tasks}
          isUpdatingTaskId={taskMutation.isPending ? taskMutation.variables?.taskId ?? null : null}
          onUpdateStatus={handleUpdateStatus}
        />
      </section>
    </main>
  );
}
