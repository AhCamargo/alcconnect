import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "payments" })
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  asaasId!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({ type: "varchar", length: 20 })
  status!: string;

  @Column({ type: "jsonb", nullable: true })
  webhookPayload!: any;

  @Column({ type: "timestamp", nullable: true })
  paidAt!: Date | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;
}
