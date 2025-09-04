// src/common/middleware/request_logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    console.log(
      JSON.stringify({
        method: req.method,
        url: req.originalUrl,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        body: req.body,
        timestamp: new Date().toISOString(),
      }),
    );
    next();
  }
}
