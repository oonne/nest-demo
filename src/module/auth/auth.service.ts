import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StaffService } from '../staff/staff.service';
import { Utils } from '../../utils/index';
const { createHash } = Utils;

@Injectable()
export class AuthService {
  constructor(
    private readonly staffService: StaffService,
    private readonly jwtService: JwtService,
  ) {}

  /*
   * 初始化管理员
   */
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

  /*
   * 生成JWT Token
   */
  private async generateJwtToken(staffId: string, role: number) {
    const payload = { sub: staffId, role };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  /*
   * 登录
   */
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
    // 验证账号是否被禁用
    if (!staff.isActive) {
      return false;
    }

    // 生成JWT Token
    const token = await this.generateJwtToken(staff.staffId, staff.role);

    // 更新Refresh Token
    const refreshToken = await this.staffService.generateRefreshToken(staff.staffId);

    // 登录成功
    return {
      staff,
      token,
      refreshToken,
    };
  }

  /*
   * 换票
   */
  async refreshToken({ staffId, refreshToken }: { staffId: string; refreshToken: string }) {
    const staff = await this.staffService.getDetail(staffId);
    if (!staff) {
      return false;
    }

    const res = await this.staffService.verifyRefreshToken({ staffId, refreshToken });
    if (!res) {
      return false;
    }

    const newRefreshToken = await this.staffService.generateRefreshToken(staffId);
    const newToken = await this.generateJwtToken(staffId, staff.role);

    return {
      token: newToken,
      refreshToken: newRefreshToken,
    };
  }
}
