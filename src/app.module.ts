import { Module, NestModule, MiddlewareConsumer, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guard/auth.guard';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './module/cats/cats.module';
import { CatsController } from './module/cats/cats.controller';

@Module({
  providers: [
    // 日志
    Logger,
    // 鉴权守卫
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [
    // 全局环境变量
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.ENV}`, '.env'],
    }),
    // 子模块
    CatsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(CatsController);
  }
}
