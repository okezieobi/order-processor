/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/common/pipes/joi-validation.pipe.ts
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import type { Schema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: Schema) {}

  transform<T>(value: any): T {
    const { error, value: validatedValue } = this.schema.validate(value, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error)
      throw new BadRequestException(
        error.details.map((d) => d.message).join(', '),
      );
    return validatedValue;
  }
}
