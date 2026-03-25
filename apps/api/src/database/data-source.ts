import "reflect-metadata";
import { DataSource } from "typeorm";
// import { User } from "../entities/User"; // Removido: TypeORM User
import { PhoneNumber } from "../entities/PhoneNumber";
import { Webhook } from "../entities/Webhook";
import { WebhookEvent } from "../entities/WebhookEvent";
import { Payment } from "../entities/Payment";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://alcconnect:alcconnect@localhost:5432/alcconnect";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: DATABASE_URL,
  entities: [PhoneNumber, Webhook, WebhookEvent, Payment],
  synchronize: false,
  logging: false,
  migrations: [],
});

export default AppDataSource;
