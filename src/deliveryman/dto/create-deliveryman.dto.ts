// src/deliveryman/dto/create-deliveryman.dto.ts

import {

  IsString,

  MinLength,

  Matches,

  IsOptional,

} from 'class-validator';
 
// Create er jonno DTO (User Category 3 rules)

export class CreateDeliverymanDto {

  @IsString()

  @Matches(/^[A-Za-z ]+$/, {

    message: 'Name must not contain special characters',

  })

  name: string;
 
  @IsString()

  @MinLength(6, {

    message: 'Password must be at least 6 characters long',

  })

  @Matches(/[a-z]/, {

    message: 'Password must contain at least one lowercase letter',

  })

  password: string;
 
  @IsString()

  @Matches(/^01[0-9]{9}$/, {

    message: 'Phone must start with 01 and be 11 digits',

  })

  phone: string;
 
  @IsOptional()

  @IsString()

  documentUrl?: string;

}
 
// Update er jonno DTO (sob field optional)

export class UpdateDeliverymanDto {

  @IsOptional()

  @IsString()

  @Matches(/^[A-Za-z ]+$/, {

    message: 'Name must not contain special characters',

  })

  name?: string;
 
  @IsOptional()

  @IsString()

  @MinLength(6, {

    message: 'Password must be at least 6 characters long',

  })

  @Matches(/[a-z]/, {

    message: 'Password must contain at least one lowercase letter',

  })

  password?: string;
 
  @IsOptional()

  @IsString()

  @Matches(/^01[0-9]{9}$/, {

    message: 'Phone must start with 01 and be 11 digits',

  })

  phone?: string;
 
  @IsOptional()

  @IsString()

  documentUrl?: string;

}

 