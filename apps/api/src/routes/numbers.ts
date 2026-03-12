import { Router, type IRouter } from "express";
import {
  listNumbers,
  buyNumber,
  getNumber,
  getNumberEvents,
} from "../controllers/numberController";
import { authMiddleware } from "../middlewares/auth";

export const numberRoutes: IRouter = Router();

numberRoutes.use(authMiddleware);
numberRoutes.get("/", listNumbers);
numberRoutes.post("/buy", buyNumber);
numberRoutes.get("/:id", getNumber);
numberRoutes.get("/:id/events", getNumberEvents);
