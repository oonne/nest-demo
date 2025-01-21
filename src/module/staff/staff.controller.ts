import { Controller, Get, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { NoLogin } from '../../common/decorator/auth.decorator';
import { resSuccess } from '../../utils/index';
import { HttpResponse } from '../../types/type';

@Controller('staff')
export class StaffController {
  constructor(
    private readonly StaffService: StaffService,
    private configService: ConfigService,
  ) {}

  /*
   * 查询全部用户
   */
  @Get('all')
  @NoLogin
  async findAll(): Promise<HttpResponse<any>> {
    const arr = this.StaffService.findAll();
    return resSuccess(arr);
  }

  /*
   * 新增用户
   */
  @Post('add')
  @NoLogin
  async add(@Body() createStaffDto: CreateStaffDto): Promise<HttpResponse<any>> {
    const arr = this.StaffService.create(createStaffDto);
    return resSuccess(arr);
  }

  /*
   * 更新用户
   */
  @Post('update')
  @NoLogin
  async update(@Body() updateStaffDto: UpdateStaffDto): Promise<HttpResponse<any>> {
    const arr = this.StaffService.update(updateStaffDto);
    return resSuccess(arr);
  }
}
