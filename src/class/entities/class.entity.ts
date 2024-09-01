import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ClassSubject } from './class-subject.entity';
import { ClassType } from './class-type.entity';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  userId: number;

  @ManyToOne(() => ClassSubject, (classSubject) => classSubject.classes)
  @IsNotEmpty()
  classSubject: ClassSubject;

  @ManyToOne(() => ClassType, (classType) => classType.classes)
  @IsNotEmpty()
  classType: ClassType;

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
