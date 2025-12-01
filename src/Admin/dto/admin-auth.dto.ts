import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class AuthDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
