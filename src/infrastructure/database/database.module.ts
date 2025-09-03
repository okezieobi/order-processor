import { Global, Module } from '@nestjs/common';
import { Model } from 'objection';
import { createKnex } from './knex.config';

@Global()
@Module({
  providers: [
    {
      provide: 'KNEX',
      useFactory: () => {
        const k = createKnex();
        Model.knex(k);
        return k;
      },
    },
  ],
  exports: ['KNEX'],
})
export class DatabaseModule {}
