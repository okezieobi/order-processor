// src/app.module.ts
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './infrastructure/database/database.module';
import { OrderModule } from './modules/order.modules'; // binds tokens to implementations
import { BrandModule } from './modules/brand.module';
import { MealModule } from './modules/meal.module';
import { AddonModule } from './modules/addon.module';
import { OrderTypeModule } from './modules/order-type.module';
import { CalculatedOrderModule } from './modules/calculated-order.module';
import { UserModule } from './modules/user.module';
import { JwtAuthGuard } from './common/auth/jwt-auth.guard';
import { RolesGuard } from './common/auth/roles.guard';

import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';

@Module({
  imports: [
    DatabaseModule,
    OrderModule,
    BrandModule,
    MealModule,
    AddonModule,
    OrderTypeModule,
    CalculatedOrderModule,
    UserModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
