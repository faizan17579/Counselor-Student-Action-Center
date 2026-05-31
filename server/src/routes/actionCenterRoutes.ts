import { Router } from "express";
import {
	getActionCenter,
	getStudents,
	markUnreadMessagesAsRead,
	markMessageAsRead,
	updateTaskStatus,
} from "../controllers/actionCenterController";

const router = Router();

router.get("/students", getStudents);
router.get("/students/:id/action-center", getActionCenter);
router.patch("/students/:id/messages/read", markUnreadMessagesAsRead);
router.patch("/students/:id/messages/:messageId/read", markMessageAsRead);
router.patch("/tasks/:taskId/status", updateTaskStatus);

export default router;
