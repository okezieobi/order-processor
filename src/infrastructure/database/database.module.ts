import { Global, Module, OnModuleDestroy } from '@nestjs/common';
import { Model } from 'objection';
import { createKnex } from './knex.config';
import type { Knex } from 'knex';

class KnexProvider implements OnModuleDestroy {
  public readonly instance: Knex;

  constructor() {
    this.instance = createKnex();
    // wire objection Model to this knex instance
    Model.knex(this.instance);
  }

  async onModuleDestroy() {
    try {
      await this.instance.destroy();
    } catch {
      // ignore errors during shutdown
    }
  }
}

@Global()
@Module({
  providers: [
    KnexProvider,
    {
      provide: 'KNEX',
      useFactory: (p: KnexProvider) => p.instance,
      inject: [KnexProvider],
    },
  ],
  exports: ['KNEX'],
})
export class DatabaseModule {}
