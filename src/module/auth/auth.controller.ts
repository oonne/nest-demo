import { Controller, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NoLogin } from '../../common/decorator/auth.decorator';
import ErrorCode from '../../constant/error-code';
import { resSuccess } from '../../utils/index';
import { AuthService } from './auth.service';
import { GenerateLoginPowDto, LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/token.dto';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  /*
   * 初始化
   */
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

  /*
   * 生成登录pow的盐和结果
   */
  @Post('generate-login-pow')
  @NoLogin
  async generateLoginPow(@Body() generateLoginPowDto: GenerateLoginPowDto) {
    const res = await this.authService.generateLoginPow(generateLoginPowDto);
    return resSuccess(res);
  }

  /*
   * 登录
   */
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
    delete staff.refreshToken;
    delete staff.loginPowSalt;
    delete staff.loginPowResult;

    return resSuccess({
      staff,
      token,
      refreshToken,
    });
  }

  /*
   * 换票
   */
  @Post('refresh-token')
  @NoLogin
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const res = await this.authService.refreshToken(refreshTokenDto);

    if (!res) {
      return {
        code: ErrorCode.AUTH_REFRESH_TOKEN_FAILED,
        message: '换票失败',
      };
    }

    return resSuccess(res);
  }
}
