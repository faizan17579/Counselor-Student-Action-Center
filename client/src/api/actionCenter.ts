import { ActionCenterResponse, StudentsResponse, TaskStatus } from "../types/actionCenter";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text ? (JSON.parse(text) as T) : ({} as T);

  if (!response.ok) {
    const errorMessage =
      typeof data === "object" && data !== null && "error" in data
        ? (data as { error?: { message?: string } }).error?.message ?? response.statusText
        : response.statusText;

    throw new Error(errorMessage || "Something went wrong.");
  }

  return data;
}

export async function fetchActionCenter(studentId: string): Promise<ActionCenterResponse> {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}/action-center`);
  return parseJsonResponse<ActionCenterResponse>(response);
}

export async function fetchStudents() {
  const response = await fetch(`${API_BASE_URL}/students`);
  return parseJsonResponse<StudentsResponse>(response);
}

export async function markUnreadMessagesAsRead(studentId: string) {
  const response = await fetch(`${API_BASE_URL}/students/${studentId}/messages/read`, {
    method: "PATCH",
  });

  return parseJsonResponse<ActionCenterResponse>(response);
}

export async function markMessageAsRead(studentId: string, messageId: string) {
  const response = await fetch(
    `${API_BASE_URL}/students/${studentId}/messages/${messageId}/read`,
    {
      method: "PATCH",
    },
  );

  return parseJsonResponse<ActionCenterResponse>(response);
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return parseJsonResponse<{ task: { id: string; studentId: string; title: string; description: string; dueDate: string; status: TaskStatus; priority: "low" | "medium" | "high" | "urgent"; createdAt: string; updatedAt: string } }>(response);
}
