import { Router } from "express";
import { createSubscription } from "../controllers/subscriptionController";

const router: Router = Router();

router.post("/", createSubscription);

export { router as subscriptionRoutes };
