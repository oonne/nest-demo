import { Injectable } from '@nestjs/common';
import { StaffService } from '../staff/staff.service';

@Injectable()
export class AuthService {
  constructor(private readonly staffService: StaffService) {}

  async login({ name, password }: { name: string; password: string }) {
    // 查询用户
    const staff = await this.staffService.getDetailByName(name);

    // 验证用户名和密码
    if (!staff || password !== staff.password) {
      return false;
    }

    // 生成JWT Token
    // TODO

    // 更新Refresh Token
    // TODO

    // 登录成功
    return staff;
  }
}
