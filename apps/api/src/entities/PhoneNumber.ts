import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
// import { User } from "./User"; // Removido: TypeORM User

@Entity({ name: "phone_numbers" })
export class PhoneNumber {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "phone_number", unique: true, type: "varchar", length: 20 })
  phoneNumber!: string;

  @Column({ type: "varchar", length: 3 })
  ddd!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  region!: string | null;

  @Column({ type: "varchar", length: 20 })
  type!: string;

  @Index()
  @Column({ type: "varchar", length: 20, default: "AVAILABLE" })
  status!: string;

  @Column({ name: "monthly_price", type: "numeric", precision: 10, scale: 2 })
  monthlyPrice!: string;

  @Column({
    name: "setup_price",
    type: "numeric",
    precision: 10,
    scale: 2,
    default: () => "0",
  })
  setupPrice!: string;

  @Column({
    name: "provider_ref",
    nullable: true,
    type: "varchar",
    length: 100,
  })
  providerRef!: string | null;

  @Column({ name: "tenant_id", type: "uuid" })
  tenantId!: string;

  // user!: User | null; // Removido: relação TypeORM User

  @Column({ name: "activated_at", type: "timestamp", nullable: true })
  activatedAt!: Date | null;

  @Column({ name: "expires_at", type: "timestamp", nullable: true })
  expiresAt!: Date | null;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}
