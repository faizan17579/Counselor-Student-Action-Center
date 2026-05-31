export type TaskStatus = "pending" | "in_progress" | "completed";

export type TaskDisplayStatus = "todo" | TaskStatus;

export interface StudentSummary {
  id: string;
  name: string;
  email: string;
  grade: number;
  gpa: number;
  counselorId: string;
  enrollmentStatus: "active" | "at_risk";
}

export interface UrgencyInfo {
  level: "low" | "medium" | "high" | "urgent";
  label: string;
  note: string;
}

export interface Message {
  id: string;
  studentId: string;
  from: string;
  subject: string;
  preview: string;
  read: boolean;
  receivedAt: string;
}

export interface Task {
  id: string;
  studentId: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskDisplayStatus;
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
}

export interface ActionCenterResponse {
  student: StudentSummary;
  unreadMessagesCount: number;
  unreadMessages: Message[];
  urgency: UrgencyInfo;
  tasks: Task[];
}

export interface StudentsResponse {
  students: StudentSummary[];
}
