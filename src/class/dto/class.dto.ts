import { IsNotEmpty, IsString, IsDateString, IsNumber } from 'class-validator';

export class ClassDto {
  @IsNotEmpty()
  @IsString()
  day: string;

  @IsNotEmpty()
  @IsNumber()
  classSubjectId: number;

  @IsNotEmpty()
  @IsNumber()
  classTypeId: number;

  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;
}
