import { Router, type IRouter } from "express";
import {
  createWebhook,
  listWebhooks,
  deleteWebhook,
  listEvents,
} from "../controllers/webhookController";
import { authMiddleware } from "../middlewares/auth";

export const webhookRoutes: IRouter = Router();

webhookRoutes.use(authMiddleware);
webhookRoutes.post("/", createWebhook);
webhookRoutes.get("/", listWebhooks);
webhookRoutes.delete("/:id", deleteWebhook);
webhookRoutes.get("/events", listEvents);
