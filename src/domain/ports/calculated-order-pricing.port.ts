// src/domain/ports/calculated-order-pricing.port.ts
export abstract class CalculatedOrderPricingPort {
  abstract computeTotal(calculatedOrderId: string): Promise<number>;
}
