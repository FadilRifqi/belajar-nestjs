import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: 'Name is required' })
  readonly name: string;

  @IsNotEmpty({ message: 'Password is required' })
  readonly password: string;
}
