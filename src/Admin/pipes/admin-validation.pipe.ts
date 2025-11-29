import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class AdminValidation implements PipeTransform {
  transform(value: any) {
   
    if (!value || typeof value !== 'object') {
      throw new BadRequestException('Invalid or missing form data.');
    }

    const { name, password, date, socialLink } = value;

    if (!name || !/^[A-Za-z\s]+$/.test(name)) {
      throw new BadRequestException('Name must contain only alphabets and spaces.');
    }

    if (!password || !/[@#$&]/.test(password)) {
      throw new BadRequestException('Password must include at least one special character (@, #, $, &).');
    }

if (!socialLink || !/^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(socialLink)) {
  throw new BadRequestException('Invalid social media link format.');
}

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
  }
   
    return value;
  }
}
