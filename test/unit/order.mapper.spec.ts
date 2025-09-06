import { fromOrderEntityPatch, toOrderEntity } from '../../src/infrastructure/objection/mappers/order.mapper';
import { OrderModel } from '../../src/infrastructure/objection/models/order.model';

describe('order.mapper', () => {
  it('maps orderTotalAmountHistory from entity patch to model shape', () => {
    const entityPatch: any = {
      orderTotalAmountHistory: [{ time: '2025-09-06T12:00:00.000Z', totalAmount: 500 }],
      paid: true,
    };

    const modelPatch = fromOrderEntityPatch(entityPatch as any);
    expect(modelPatch.order_total_amount_history).toBeDefined();
    expect(Array.isArray(modelPatch.order_total_amount_history)).toBeTruthy();
    expect((modelPatch.order_total_amount_history as any)[0].total_amount).toBe(500);
  });

  it('maps model to entity and normalizes history', () => {
    const model: any = new OrderModel();
    model.id = 'test-id';
    model.order_total_amount_history = [{ time: '2025-09-06T12:00:00.000Z', total_amount: 700 }];

    const entity = toOrderEntity(model as any);
    expect(entity.orderTotalAmountHistory).toBeDefined();
    expect(entity.orderTotalAmountHistory[0].totalAmount).toBe(700);
  });
});
