import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Class } from './class.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class ClassSubject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  code: string;

  @ManyToOne(() => User, (user) => user.classSubjects)
  user: User;

  @Column()
  name: string;

  @OneToMany(() => Class, (classEntity) => classEntity.classSubject)
  classes: Class[];
}
