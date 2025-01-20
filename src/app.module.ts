import { Module, NestModule, MiddlewareConsumer, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from './common/guard/auth.guard';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './module/cats/cats.module';
import { CatsController } from './module/cats/cats.controller';
import { UserModule } from './module/user/user.module';
import { UserController } from './module/user/user.controller';
import { User } from './module/user/user.entity';

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
    // 数据库
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 13306,
      username: 'root',
      password: '12345',
      database: 'nest_demo',
      entities: [User],
      synchronize: true,
    }),
    // 子模块
    CatsModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(CatsController);
    consumer.apply(LoggerMiddleware).forRoutes(UserController);
  }
}
