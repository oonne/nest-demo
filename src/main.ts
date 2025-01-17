import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filter/any-exception.filter';
import { ValidationPipe } from './common/pipe/validate.pipe';

async function bootstrap() {
  /* 日志配置 */
  const instance = winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          winston.format.colorize(),
          winston.format.simple(),
        ),
      }),
      new DailyRotateFile({
        filename: 'logs/app-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '10m',
        maxFiles: '14d',
      }),
    ],
  });

  /* 创建 nest 应用 */
  const logger = new Logger();
  logger.log(`--------启动服务--------`);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    logger: WinstonModule.createLogger({
      instance,
    }),
  });

  // 异常过滤器（用于自定义异常）
  app.useGlobalFilters(new AllExceptionsFilter());

  // 验证入参管道
  app.useGlobalPipes(new ValidationPipe());

  // 环境变量
  const configService = app.get(ConfigService);
  const envName = configService.get<string>('ENV_NAME');
  const port = configService.get<number>('PORT');
  logger.log(`-------环境:[${envName}]----------------`);
  logger.log(`-------端口:[${port}]----------------`);

  await app.listen(10011, '0.0.0.0');
}
bootstrap();
