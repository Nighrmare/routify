import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('log_entries')
export class LogEntry {
  @PrimaryGeneratedColumn()
  // Unique log entry ID
  id: number;

  @Column({ length: 10 })
  // HTTP method (GET, POST, etc.)
  method: string;

  @Column({ length: 1024 })
  // Requested URL
  url: string;

  @Column({ type: 'int' })
  // HTTP status code
  status: number;

  @Column({ type: 'int', name: 'duration_ms' })
  // Duration in milliseconds
  durationMs: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @Index()
  // Timestamp of the log entry
  timestamp: Date;

  @Column({ type: 'int', nullable: true, name: 'user_id' })
  // Optional ID of the user making the request
  userId?: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'user_email' })
  // Optional email of the user
  userEmail?: string | null;
}
