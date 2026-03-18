import { Router } from "express";
import { createSubscription } from "../controllers/subscriptionController";

const router = Router();

router.post("/", createSubscription);

export { router as subscriptionRoutes };
