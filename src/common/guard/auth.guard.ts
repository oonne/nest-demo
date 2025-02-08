/*
 * 全局鉴权守卫
 */
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 如果设置了免登录，则直接返回true
    const noLogin = this.reflector.get<string[]>('noLogin', context.getHandler());
    if (noLogin) {
      return true;
    }

    // 判断JWT
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    if (!token) {
      throw new UnauthorizedException('token为空');
    }

    // 验证token
    try {
      const bearerToken = token.split(' ')[1];
      const decoded = this.jwtService.verify(bearerToken);

      // 将解码后的用户信息添加到请求对象中
      request.staff = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
