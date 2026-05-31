export type TaskStatus = "pending" | "in_progress" | "completed";

export type TaskDataStatus = "todo" | TaskStatus;

export type PriorityLevel = "low" | "medium" | "high" | "urgent";

export type EnrollmentStatus = "active" | "at_risk";

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  grade: number;
  gpa: number;
  counselorId: string;
  enrollmentStatus: EnrollmentStatus;
}

export interface TaskRecord {
  id: string;
  studentId: string;
  title: string;
  description: string;
  status: TaskDataStatus;
  priority: PriorityLevel;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageRecord {
  id: string;
  studentId: string;
  from: string;
  subject: string;
  preview: string;
  read: boolean;
  receivedAt: string;
}

export interface ActionCenterResponse {
  student: StudentRecord;
  unreadMessagesCount: number;
  unreadMessages: MessageRecord[];
  urgency: {
    level: PriorityLevel;
    label: string;
    note: string;
  };
  tasks: TaskRecord[];
}
