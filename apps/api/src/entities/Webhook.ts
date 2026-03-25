import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { WebhookEvent } from "./WebhookEvent";

@Entity({ name: "webhooks" })
export class Webhook {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({ type: "varchar", length: 255 })
  url!: string;

  @Column({ type: "varchar", length: 100 })
  eventType!: string;

  @Column({ type: "boolean", default: true })
  active!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;

  @OneToMany(() => WebhookEvent, (event: WebhookEvent) => event.webhook)
  events!: WebhookEvent[];
}
