import { Router, type IRouter } from "express";
import { createLead } from "../controllers/leadController";

export const leadRoutes: IRouter = Router();

leadRoutes.post("/lead", createLead);
