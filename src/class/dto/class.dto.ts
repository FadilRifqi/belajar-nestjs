import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class ClassDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  day: string;

  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;
}
