import { Controller, Get, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NoLogin } from '../../common/decorator/auth.decorator';
import { resSuccess } from '../../utils/index';
import { HttpResponse } from '../../types/type';

@Controller('user')
export class UserController {
  constructor(
    private readonly UserService: UserService,
    private configService: ConfigService,
  ) {}

  /*
   * 查询全部用户
   */
  @Get('all')
  @NoLogin
  async findAll(): Promise<HttpResponse<any>> {
    const arr = this.UserService.findAll();
    return resSuccess(arr);
  }

  /*
   * 新增用户
   */
  @Post('add')
  @NoLogin
  async add(@Body() createUserDto: CreateUserDto): Promise<HttpResponse<any>> {
    const arr = this.UserService.create(createUserDto);
    return resSuccess(arr);
  }
}
