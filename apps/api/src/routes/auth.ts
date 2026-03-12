import { Router, type IRouter } from "express";
import { register, login, me } from "../controllers/authController";
import { authMiddleware } from "../middlewares/auth";

export const authRoutes: IRouter = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/me", authMiddleware, me);
