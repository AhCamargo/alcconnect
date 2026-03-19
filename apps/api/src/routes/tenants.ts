import { Router } from "express";
import { createTenant } from "../controllers/tenantController";

const router: Router = Router();

router.post("/", createTenant);

export { router as tenantRoutes };
