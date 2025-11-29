import {
  IsString,
  IsNotEmpty,
  Matches,
  IsDateString,
  IsUrl,
} from 'class-validator';

export class AdminDto {
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must contain only alphabets and spaces.',
  })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/[@#$&]/, {
    message: 'Password must include at least one special character (@, #, $, &).',
  })
  password: string;


  @IsDateString({}, { message: 'Invalid date format. Use YYYY-MM-DD.' })
  date: string;

  @IsUrl(
    {
      protocols: ['http', 'https'],
      require_protocol: true,
      require_tld: true,
    },
    { message: 'Invalid social media link format.' },
  )
  socialLink: string;
}
