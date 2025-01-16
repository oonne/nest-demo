import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filter/any-exception.filter';
import { ValidationPipe } from './common/pipe/validate.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  // 全局异常过滤器（用于自定义异常）
  app.useGlobalFilters(new AllExceptionsFilter());

  // 全局管道
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(10011, '0.0.0.0');
}
bootstrap();
