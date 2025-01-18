/*
 * 全局异常过滤器
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

/*
 * 全局异常过滤器
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof Error ? exception.message : '服务器异常';

    // 打印错误日志
    const logger = new Logger();
    logger.error(`[${request.url}]接口异常: ${message}`);

    // 返回
    response.status(status).send({
      code: status,
      message: message,
      data: {
        time: new Date().getTime(),
        timestamp: new Date(),
      },
    });
  }
}
