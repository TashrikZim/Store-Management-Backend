// src/customer/dto/create-customer.dto.ts

import {
  IsNotEmpty,
  Matches,
} from 'class-validator';

// User Category 1 rules:
// - Name should only contain alphabets
// - Email is required + must contain '@' and .xyz domain
// - NID number format (10–17 digits)

export class CreateCustomerDto {
  // Name Should only contain Alphabets
  @IsNotEmpty({ message: 'Name is required' })
  @Matches(/^[A-Za-z ]+$/, {
    message: 'Name should contain only alphabets',
  })
  name: string;

  // Email Address is required, must contain @ and .xyz domain
  @IsNotEmpty({ message: 'Email is required' })
  @Matches(/^[^@]+@[^@]+\.xyz$/, {
    message: 'Email must be in .xyz domain and contain @',
  })
  email: string;

  // NID number format (10–17 digits)
  @IsNotEmpty({ message: 'NID number is required' })
  @Matches(/^[0-9]{10,17}$/, {
    message: 'NID number must be 10-17 digits',
  })
  nidNumber: string;
}
