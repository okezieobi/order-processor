// src/infrastructure/objection/repositories/objection-calculated-order-pricing.port.ts
import { CalculatedOrderPricingPort } from '../../../domain/ports/calculated_order_pricing.port';
import { CalculatedOrderMealModel } from '../models/calculated_order_meal.model';
import { CalculatedOrderMealAddonModel } from '../models/calculated_meal_order_addon.model';
import { CalculatedOrderModel } from '../models/calculated_order.model';

export class ObjectionCalculatedOrderPricing
  implements CalculatedOrderPricingPort
{
  async computeTotal(calculatedOrderId: string): Promise<number> {
    const items = await CalculatedOrderMealModel.query().where({
      calculated_order_id: calculatedOrderId,
    });
    const itemIds = items.map((i) => i.id);
    const addons = itemIds.length
      ? await CalculatedOrderMealAddonModel.query().whereIn(
          'calculated_order_meal_id',
          itemIds,
        )
      : [];

    let subtotal = 0;
    for (const i of items) {
      const iAddons = addons.filter((a) => a.calculated_order_meal_id === i.id);
      const addonTotal = iAddons.reduce(
        (acc, a) => acc + a.amount * a.quantity,
        0,
      );
      subtotal += i.amount * i.quantity + addonTotal;
    }

    const calc = await CalculatedOrderModel.query().findById(calculatedOrderId);
    let fees = 0;
    if (calc) {
      const deliveryFee = calc.free_delivery ? 0 : calc.delivery_fee;
      fees = deliveryFee + (calc.service_charge || 0);
    }
    return subtotal + fees;
  }
}
