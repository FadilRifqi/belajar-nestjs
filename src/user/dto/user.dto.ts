import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  isEmailConfirmed: boolean;

  @Expose()
  timestamp: Date;

  // Exclude password field
  @Exclude()
  password?: string;
}
