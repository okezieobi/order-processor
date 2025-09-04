// src/common/middleware/request-logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    console.log(
      JSON.stringify({
        method: req.method,
        url: req.originalUrl,
        body: req.body,
        timestamp: new Date().toISOString(),
      }),
    );
    next();
  }
}
