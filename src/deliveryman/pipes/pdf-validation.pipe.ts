// src/deliveryman/pipes/pdf-validation.pipe.ts
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
 
@Injectable()
export class PdfValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Document file is required');
    }
 
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are allowed');
    }
 
    return file;
  }
}