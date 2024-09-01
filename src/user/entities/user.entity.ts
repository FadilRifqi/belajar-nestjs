import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsEmail, Length, Matches } from 'class-validator';
import { ConfirmEmailToken } from 'src/auth/entities/confirm-email.entity';
import { ClassSubject } from 'src/class/entities/class-subject.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Length(8) // Ensures a minimum length of 8 characters
  @Matches(/^(?=.*[A-Z])(?=.*[\W_]).*$/, {
    message:
      'Password must contain at least one uppercase letter and one special character.',
  })
  password: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @OneToMany(
    () => ConfirmEmailToken,
    (confirmEmailToken) => confirmEmailToken.user,
  )
  confirmEmailTokens: ConfirmEmailToken[];

  @OneToMany(() => ClassSubject, (classSubject) => classSubject.user)
  classSubjects: ClassSubject[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
