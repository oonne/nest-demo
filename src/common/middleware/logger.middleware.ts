import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const logger = new Logger();
    logger.log(`[${req.originalUrl}] 收到请求: ${req.method}`);
    next();
  }
}
