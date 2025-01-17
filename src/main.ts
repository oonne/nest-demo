import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filter/any-exception.filter';
import { ValidationPipe } from './common/pipe/validate.pipe';

async function bootstrap() {
  console.log(`--------启动服务--------`);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  // 异常过滤器（用于自定义异常）
  app.useGlobalFilters(new AllExceptionsFilter());

  // 验证入参管道
  app.useGlobalPipes(new ValidationPipe());

  // 环境变量
  const configService = app.get(ConfigService);
  const envName = configService.get<string>('ENV_NAME');
  const port = configService.get<number>('PORT');
  console.log(`--------环境:[${envName}]--------`);
  console.log(`--------端口:[${port}]--------`);

  await app.listen(10011, '0.0.0.0');
}
bootstrap();
