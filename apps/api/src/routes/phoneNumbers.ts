import { Router, type IRouter } from "express";
import {
  listAvailable,
  listMine,
  getById,
  listAll,
  create,
  update,
  remove,
} from "../controllers/phoneNumberController";
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/admin";

export const phoneNumberRoutes: IRouter = Router();

// Públicas
phoneNumberRoutes.get("/", listAvailable);

// Admin (antes de /:id para não ser capturado como param)
phoneNumberRoutes.get("/admin/all", authMiddleware, adminMiddleware, listAll);

// Autenticadas
phoneNumberRoutes.get("/mine", authMiddleware, listMine);
phoneNumberRoutes.get("/:id", authMiddleware, getById);

// Admin — escrita
phoneNumberRoutes.post("/", authMiddleware, adminMiddleware, create);
phoneNumberRoutes.put("/:id", authMiddleware, adminMiddleware, update);
phoneNumberRoutes.delete("/:id", authMiddleware, adminMiddleware, remove);
