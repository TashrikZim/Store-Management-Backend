import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  mobile: string;

  @IsString()
  gender: string;

  @IsString()
  city: string;
}
