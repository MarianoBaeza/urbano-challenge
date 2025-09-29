import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Role } from 'src/enums/role.enum';

export class UserQuery {
  @IsOptional()
  @IsString()
  @Type(() => String)
  @Transform(({ value }) => (value === '' ? undefined : value))
  firstName?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  @Transform(({ value }) => (value === '' ? undefined : value))
  lastName?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  @Transform(({ value }) => (value === '' ? undefined : value))
  username?: string;

  @IsOptional()
  @IsEnum(Role, {
    message: 'role must be one of: user, editor, admin',
  })
  @Transform(({ value }) => (value === '' ? undefined : value))
  role?: Role;
}
