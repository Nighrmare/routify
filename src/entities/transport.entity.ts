import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum TransportType {
  BUS = 'bus',
  TAXI = 'taxi',
  METRO = 'metro',
  BICYCLE = 'bicycle',
  WALKING = 'walking',
  PRIVATE_CAR = 'private_car',
}

@Entity('transports')
export class Transport {
  @PrimaryGeneratedColumn()
  id: number; // Unique identifier for each transport record

  @Column({
    type: 'enum',
    enum: TransportType,
  })
  type: TransportType; // Selected transport method

  @Column()
  origin: string; // Starting point of the route

  @Column()
  destination: string; // Ending point of the route

  @Column('decimal', { precision: 10, scale: 2 })
  distance: number; // Total distance in kilometers

  @Column('int')
  duration: number; // Duration in minutes

  @Column('decimal', { precision: 10, scale: 2 })
  cost: number; // Cost in Colombian pesos

  @Column('decimal', { precision: 5, scale: 2 })
  comfort: number; // Comfort rating (1–10)

  @Column('decimal', { precision: 5, scale: 2 })
  reliability: number; // Reliability rating (1–10)

  @Column({ nullable: true })
  notes: string; // Optional notes or observations

  @CreateDateColumn()
  createdAt: Date; // Timestamp automatically generated when the record is created
}
