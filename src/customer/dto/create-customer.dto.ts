import {IsNotEmpty,Matches,} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty({ message: 'Name is required' })
  @Matches(/^[A-Za-z ]+$/, {
    message: 'Name should contain only alphabets',
  })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @Matches(/^[^@]+@[^@]+\.xyz$/, {
    message: 'Email must be in .xyz domain and contain @',
  })
  email: string;

  @IsNotEmpty({ message: 'NID number is required' })
  @Matches(/^[0-9]{10,17}$/, {
    message: 'NID number must be 10-17 digits',
  })
  nidNumber: string;
}
