/*
 * 日志中间件
 * 只记录收到了哪些HTTP请求。不打印请求和响应内容
 */
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
