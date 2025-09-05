// src/modules/brand.module.ts
import { Module } from '@nestjs/common';
import { BrandController } from '../interfaces/http/controllers/brand.controller';
import { BrandService } from '../application/services/brand.service';
import { BrandRepository } from '../domain/repositories/brand.repository';
import { ObjectionBrandRepository } from '../infrastructure/objection/repositories/objection-brand.repository';

@Module({
  controllers: [BrandController],
  providers: [
    BrandService,
    { provide: BrandRepository, useClass: ObjectionBrandRepository },
  ],
})
export class BrandModule {}
