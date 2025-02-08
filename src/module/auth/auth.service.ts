import { Injectable } from '@nestjs/common';
import { StaffService } from '../staff/staff.service';
import { Utils } from '../../utils/index';

const { createHash } = Utils;

@Injectable()
export class AuthService {
  constructor(private readonly staffService: StaffService) {}

  async init() {
    // 查询是否有staff
    const staff = await this.staffService.getList({
      pageNo: 1,
      pageSize: 1,
    });

    if (staff.total > 0) {
      return false;
    }

    // 如果staff为空，创建一个管理员，账号和密码都是admin
    await this.staffService.create({
      name: 'admin',
      password: createHash('admin', 32),
      role: 1,
      isActive: true,
    });
    return true;
  }

  async login({ name, password }: { name: string; password: string }) {
    // 查询用户
    const staff = await this.staffService.getDetailByName(name);

    // 验证账号
    if (!staff) {
      return false;
    }
    // 验证密码
    if (this.staffService.hashPassword(password, staff.staffId) !== staff.password) {
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
