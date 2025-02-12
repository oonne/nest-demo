/*
 * 角色校验守卫
 */
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // 获取路由上设置的角色列表
    const roles = this.reflector.get<number[]>('roles', context.getHandler());
    // 如果没有设置角色限制，则直接通过
    if (!roles || roles.length === 0) {
      return true;
    }

    // 从 AuthGuard 中获取解析的用户信息
    const request = context.switchToHttp().getRequest();
    const staff = request.staff;

    // 如果没有用户信息，说明未经过 AuthGuard 验证，抛出异常
    if (!staff) {
      throw new ForbiddenException('未登录');
    }

    // 验证用户角色是否在允许的角色列表中
    const hasRole = roles.includes(staff.role);
    if (!hasRole) {
      throw new ForbiddenException('无访问权限');
    }

    return true;
  }
}
