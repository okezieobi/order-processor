
import { Module } from '@nestjs/common';
import { AddonController } from '../interfaces/http/controllers/addon.controller';
import { AddonService } from '../application/services/addon.service';
import { AddonRepository } from '../domain/repositories/addon.repository';
import { ObjectionAddonRepository } from '../infrastructure/objection/repositories/objection-addon.repository';

@Module({
  controllers: [AddonController],
  providers: [
    AddonService,
    { provide: AddonRepository, useClass: ObjectionAddonRepository },
  ],
})
export class AddonModule {}
