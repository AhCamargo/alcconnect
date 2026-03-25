import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Webhook } from "./Webhook";

@Entity({ name: "webhook_events" })
export class WebhookEvent {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  webhookId!: string;

  @ManyToOne(() => Webhook, (webhook) => webhook.events, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "webhook_id" })
  webhook!: Webhook;

  @Column({ type: "jsonb" })
  payload!: any;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;
}
