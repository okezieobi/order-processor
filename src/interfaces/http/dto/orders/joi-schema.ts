// src/interfaces/http/dto/orders/joi-schemas.ts
import Joi from 'joi';

export const createOrderSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  orderCode: Joi.string().optional(),
  calculatedOrderId: Joi.string().uuid().optional(),
  orderTypeId: Joi.string().uuid().optional(),
  paid: Joi.boolean().optional(),
});
