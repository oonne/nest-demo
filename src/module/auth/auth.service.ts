import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login({ name, password }: { name: string; password: string }) {
    // 这里实现登录逻辑
    return {
      name,
      password,
    };
  }
}
