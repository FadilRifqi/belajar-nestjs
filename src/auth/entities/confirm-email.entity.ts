import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class ConfirmEmailToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  token: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.confirmEmailTokens)
  user: User;

  @BeforeInsert()
  setExpiryDate() {
    const now = new Date();
    this.expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now
  }
}
