import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ClassSubjectDto {
  @IsOptional()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
