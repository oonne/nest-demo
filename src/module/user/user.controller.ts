import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { NoLogin } from '../../common/decorator/auth.decorator';
import { resSuccess } from '../../utils/index';
import { HttpResponse } from '../../types/type';

@Controller('users')
export class UserController {
  constructor(
    private readonly UserService: UserService,
    private configService: ConfigService,
  ) {}

  @Get('all')
  @NoLogin
  async findAll(): Promise<HttpResponse<any>> {
    const arr = this.UserService.findAll();
    return resSuccess(arr);
  }
}
