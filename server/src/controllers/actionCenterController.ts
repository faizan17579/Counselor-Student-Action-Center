import { Request, Response } from "express";
import { messages, persistMockData, students, tasks } from "../data/mockData";
import { ActionCenterResponse, EnrollmentStatus, TaskStatus } from "../types/actionCenter";

const validStatuses: TaskStatus[] = ["pending", "in_progress", "completed"];

const urgencyByEnrollmentStatus: Record<EnrollmentStatus, ActionCenterResponse["urgency"]> = {
  active: {
    level: "medium",
    label: "Monitor",
    note: "Student is on track but should be reviewed regularly.",
  },
  at_risk: {
    level: "urgent",
    label: "Immediate attention",
    note: "Student is marked at risk and needs counselor follow-up.",
  },
};

function sendError(res: Response, statusCode: number, message: string) {
  return res.status(statusCode).json({ error: { message } });
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && validStatuses.includes(value as TaskStatus);
}

function buildActionCenterResponse(studentId: string): ActionCenterResponse | null {
  const student = students.find((item) => item.id === studentId);

  if (!student) {
    return null;
  }

  const studentTasks = tasks.filter((task) => task.studentId === studentId);
  const unreadMessages = messages.filter(
    (message) => message.studentId === studentId && !message.read,
  );

  return {
    student,
    unreadMessagesCount: unreadMessages.length,
    unreadMessages,
    urgency: urgencyByEnrollmentStatus[student.enrollmentStatus],
    tasks: studentTasks,
  };
}

export function getActionCenter(req: Request, res: Response) {
  const { id } = req.params;
  const actionCenter = buildActionCenterResponse(id);

  if (!actionCenter) {
    return sendError(res, 404, "Student not found.");
  }

  return res.json(actionCenter);
}

export function getStudents(_req: Request, res: Response) {
  return res.json({ students });
}

export function updateTaskStatus(req: Request, res: Response) {
  const { taskId } = req.params;
  const { status } = req.body as { status?: unknown };

  if (!isTaskStatus(status)) {
    return sendError(res, 400, "Status must be pending, in_progress, or completed.");
  }

  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return sendError(res, 404, "Task not found.");
  }

  task.status = status;
  task.updatedAt = new Date().toISOString();
  persistMockData();

  return res.json({ task });
}

export function markUnreadMessagesAsRead(req: Request, res: Response) {
  const { id } = req.params;
  const actionCenter = buildActionCenterResponse(id);

  if (!actionCenter) {
    return sendError(res, 404, "Student not found.");
  }

  const unreadMessages = messages.filter(
    (message) => message.studentId === id && !message.read,
  );

  unreadMessages.forEach((message) => {
    message.read = true;
  });

  persistMockData();

  return res.json(buildActionCenterResponse(id));
}

export function markMessageAsRead(req: Request, res: Response) {
  const { id, messageId } = req.params;
  const actionCenter = buildActionCenterResponse(id);

  if (!actionCenter) {
    return sendError(res, 404, "Student not found.");
  }

  const message = messages.find((item) => item.id === messageId && item.studentId === id);

  if (!message) {
    return sendError(res, 404, "Message not found.");
  }

  message.read = true;
  persistMockData();

  return res.json(buildActionCenterResponse(id));
}
