import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  async login(loginDto: LoginDto) {
    // 这里实现登录逻辑
    return {
      access_token: 'mock_token', // 示例返回，实际应该实现 JWT 等token生成
      user: {
        username: loginDto.name,
      },
    };
  }
}
