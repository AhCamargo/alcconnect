import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth";
import { numberRoutes } from "./routes/numbers";
import { webhookRoutes } from "./routes/webhooks";
import { leadRoutes } from "./routes/leads";

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

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "alcconnect-api" });
});

app.listen(PORT, () => {
  console.log(`[ALC Connect API] rodando na porta ${PORT}`);
});
