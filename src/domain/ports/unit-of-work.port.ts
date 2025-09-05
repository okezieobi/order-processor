// src/domain/ports/unit-of-work.port.ts
export abstract class UnitOfWork {
  abstract run<T>(work: (tx: unknown) => Promise<T>): Promise<T>;
}
