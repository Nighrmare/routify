import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
@Entity('comparisons')
export class Comparison {
  @PrimaryGeneratedColumn()
  // Unique identifier for the comparison
  id: number;

  @Column()
  // ID of the user who created the comparison
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  // Relation to the User entity
  user: User;

  @Column()
  // Origin location
  origin: string;

  @Column()
  // Destination location
  destination: string;

  @Column('simple-json')
  // JSON storing transport comparison results
  results: any;

  @CreateDateColumn()
  // Timestamp when the comparison was created
  createdAt: Date;
}
