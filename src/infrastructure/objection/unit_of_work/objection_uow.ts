// src/infrastructure/objection/unit-of-work/objection-uow.ts
import { UnitOfWork } from '../../../domain/ports/unit_of_work.port';
import { Model, transaction } from 'objection';

export class ObjectionUnitOfWork extends UnitOfWork {
  run<T>(work: (tx: unknown) => Promise<T>): Promise<T> {
    return transaction(Model.knex(), (trx) => work(trx as unknown));
  }
}
