import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class CourseQuery {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  name?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  description?: string;
}
