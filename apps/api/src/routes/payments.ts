import { Router } from "express";
import { createPayment } from "../controllers/paymentController";

const router: Router = Router();

router.post("/", createPayment);

export { router as paymentRoutes };
