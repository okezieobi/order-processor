import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from '@nestjs/common';
import { OrderService } from '../../application/services/order.service';

@Injectable()
export class OrderOwnershipGuard implements CanActivate {
  constructor(private readonly orderService: OrderService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const orderId = request.params.id;
    const user = request.user as { id?: string; roles?: unknown };

    if (!orderId || !user) {
      return false;
    }

    const order = await this.orderService.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Attach order to request for later use
    request.order = order;

    if (Array.isArray(user.roles) && user.roles.includes('admins')) {
      return true;
    }

    if (order.userId !== user.id) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
