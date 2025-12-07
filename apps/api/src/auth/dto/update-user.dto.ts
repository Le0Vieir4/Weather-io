import { IsOptional, MaxLength, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'First name must be string' })
  @MaxLength(50, { message: 'First name must not exceed 50 caracteres long.' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be string' })
  @MaxLength(50, { message: 'Last name must not exceed 50 caracteres long.' })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'Username must be string' })
  @MaxLength(50, { message: 'Username must not exceed 50 caracteres long.' })
  username?: string;
  @IsOptional()
  @IsString({ message: 'Email must be string' })
  @MaxLength(100, { message: 'Email must not exceed 100 caracteres long.' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Password must be string' })
  @MaxLength(100, { message: 'Password must not exceed 100 caracteres long.' })
  password?: string;

  @IsOptional()
  @IsString({ message: 'Picture must be string' })
  picture?: string;
}
