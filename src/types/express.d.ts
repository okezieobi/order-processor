import { Order } from '../../domain/entities/order.entity';

declare global {
  namespace Express {
    interface Request {
      order?: Order;
    }
  }
}
