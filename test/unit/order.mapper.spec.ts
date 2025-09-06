import {
  fromOrderEntityPatch,
  toOrderEntity,
} from '../../src/infrastructure/objection/mappers/order.mapper';
import { OrderEntity } from '../../src/domain/entities/order.entity';
import { OrderModel } from '../../src/infrastructure/objection/models/order.model';

describe('order.mapper', () => {
  it('maps orderTotalAmountHistory from entity patch to model shape', () => {
    type MinimalEntityPatch = {
      orderTotalAmountHistory?: Array<
        { time: string; totalAmount: number } | string
      >;
      paid?: boolean;
    };

    const entityPatch: MinimalEntityPatch = {
      orderTotalAmountHistory: [
        { time: '2025-09-06T12:00:00.000Z', totalAmount: 500 },
      ],
      paid: true,
    };

    const modelPatch = fromOrderEntityPatch(
      entityPatch as unknown as Partial<OrderEntity>,
    );
    expect(modelPatch.order_total_amount_history).toBeDefined();
    expect(Array.isArray(modelPatch.order_total_amount_history)).toBeTruthy();
    const first = (
      modelPatch.order_total_amount_history as unknown as {
        total_amount?: number;
      }[]
    )[0];
    expect(first.total_amount).toBe(500);
  });

  it('maps model to entity and normalizes history', () => {
    const model = new OrderModel();
    (model as unknown as { id?: string }).id = 'test-id';
    (
      model as unknown as { order_total_amount_history?: unknown }
    ).order_total_amount_history = [
      { time: '2025-09-06T12:00:00.000Z', total_amount: 700 },
    ];

    const entity = toOrderEntity(model);
    expect(entity.orderTotalAmountHistory).toBeDefined();
    expect(entity.orderTotalAmountHistory[0].totalAmount).toBe(700);
  });
});
