import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
export class RegisterDto {
  @IsEmail({}, { message: 'Please provide an valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Username must be string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 caracteres long.' })
  @MaxLength(20, { message: 'Username must be less than 20 caracteres long.' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores.',
  })
  username: string;

  @IsString({ message: 'Password must be string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 caracteres long.' })
  @MaxLength(32, { message: 'Password must be less than 32 caracteres long.' })
  password: string;

  @IsString({ message: 'First name must be string' })
  @IsOptional()
  @MaxLength(50, { message: 'First name must not exceed 50 caracteres long.' })
  firstName?: string;

  @IsString({ message: 'Last name must be string' })
  @IsOptional()
  @MaxLength(50, { message: 'Last name must not exceed 50 caracteres long.' })
  lastName?: string;
}
