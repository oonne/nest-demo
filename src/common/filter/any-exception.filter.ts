import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

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

    // 此处需要打印错误日志
    // TODO
    console.log(request.url, message);

    // 返回
    response.status(status).send({
      statusCode: status,
      time: new Date().getTime(),
      timestamp: new Date(),
      message: message,
    });
  }
}
