import { Controller, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NoLogin } from '../../common/decorator/auth.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('login')
  @NoLogin
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
