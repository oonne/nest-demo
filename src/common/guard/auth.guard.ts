/*
 * 全局鉴权守卫
 */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 如果设置了免登录，则直接返回true
    const noLogin = this.reflector.get<string[]>('noLogin', context.getHandler());
    if (noLogin) {
      return true;
    }

    // 判断JWT
    const request = context.switchToHttp().getRequest();
    console.log('TODO 此处要写个鉴权守卫', request.headers);

    return true;
  }
}
