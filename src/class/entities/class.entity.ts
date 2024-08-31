import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  userId: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  day: string;

  @Column()
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @Column()
  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
