import { Controller, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NoLogin } from '../../common/decorator/auth.decorator';
import ErrorCode from '../../constant/error-code';
import { resSuccess } from '../../utils/index';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('init')
  @NoLogin
  async init() {
    const res = await this.authService.init();

    if (!res) {
      return {
        code: ErrorCode.STAFF_NOT_FOUND,
        message: '无须初始化',
      };
    }
    return resSuccess('初始化成功');
  }

  @Post('login')
  @NoLogin
  async login(@Body() loginDto: LoginDto) {
    const res = await this.authService.login(loginDto);

    if (!res) {
      return {
        code: ErrorCode.STAFF_NOT_FOUND,
        message: '登录失败',
      };
    }

    const { staff, token, refreshToken } = res;

    // 过滤不显示的字段
    delete staff.id;
    delete staff.password;

    return resSuccess({
      staff,
      token,
      refreshToken,
    });
  }
}
