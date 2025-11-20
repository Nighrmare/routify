import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  TRUCKER = 'trucker',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  // Unique user ID
  id: number;

  @Column({ nullable: false, unique: true })
  // User email (unique)
  email: string;

  @Exclude()
  @Column()
  // Hashed password (excluded from serialization)
  password: string;

  @Column()
  // User name
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  // User role
  role: UserRole;

  @Column({ default: true })
  // Account status (true/false)
  status: boolean;

  @CreateDateColumn()
  // Timestamp when the user was created
  createdAt: Date;

  @UpdateDateColumn()
  // Timestamp when the user was last updated
  updatedAt: Date;
}
