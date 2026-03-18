import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth";
import { numberRoutes } from "./routes/numbers";
import { webhookRoutes } from "./routes/webhooks";
import { leadRoutes } from "./routes/leads";
import { phoneNumberRoutes } from "./routes/phoneNumbers";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/numbers", numberRoutes);
app.use("/webhooks", webhookRoutes);
app.use("/api", leadRoutes);
app.use("/api/phone-numbers", phoneNumberRoutes);

import { tenantRoutes } from "./routes/tenants";
import { subscriptionRoutes } from "./routes/subscriptions";
import { paymentRoutes } from "./routes/payments";

app.use("/api/tenants", tenantRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payments", paymentRoutes);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "alcconnect-api" });
});

app.listen(PORT, () => {
  console.log(`[ALC Connect API] rodando na porta ${PORT}`);
});
