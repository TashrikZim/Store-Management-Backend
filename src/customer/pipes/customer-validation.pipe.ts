import { ValidationPipe } from '@nestjs/common';
export const CustomerValidationPipe = new ValidationPipe({
  transform: true,            
  whitelist: true,             
  forbidNonWhitelisted: true,  
});
