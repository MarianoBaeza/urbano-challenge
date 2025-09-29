import { IsOptional, IsString } from 'class-validator';

export class ContentQuery {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
