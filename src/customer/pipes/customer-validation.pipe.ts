// src/customer/pipes/customer-validation.pipe.ts

import { ValidationPipe } from '@nestjs/common';

// Ekta shared ValidationPipe, customer module-er POST & PUT e use korbo
export const CustomerValidationPipe = new ValidationPipe({
  transform: true,             // form-data/x-www-form-urlencoded theke type cast
  whitelist: true,             // DTO te nai emon field automatic remove
  forbidNonWhitelisted: true,  // extra field asle error dibe
});
