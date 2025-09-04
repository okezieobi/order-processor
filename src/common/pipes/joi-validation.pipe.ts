// src/common/pipes/joi-validation.pipe.ts
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import type { Schema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Schema) {}
  transform(value: any) {
    const { error, value: v } = this.schema.validate(value, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error)
      throw new BadRequestException(
        error.details.map((d) => d.message).join(', '),
      );
    return v;
  }
}
