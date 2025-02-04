import { Controller, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { NoLogin } from '../../common/decorator/auth.decorator';
import { resSuccess, Utils } from '../../utils/index';
import { HttpResponse, ListResponse } from '../../types/type';
import { Staff } from './staff.entity';

@Controller('staff')
export class StaffController {
  constructor(
    private readonly StaffService: StaffService,
    private configService: ConfigService,
  ) {}

  /*
   * 查询全部用户
   */
  @Post('get-list')
  @NoLogin
  async getList(): Promise<HttpResponse<ListResponse<Staff>>> {
    // TODO：分页
    // TODO: 筛选/搜索
    // TODO：排序
    const list = await this.StaffService.getList();

    // 过滤不显示的字段
    list.forEach((item) => {
      delete item.password;
      delete item.refreshToken;
    });

    // 返回
    return resSuccess({
      pageNo: 1,
      total: 20,
      list: list,
    });
  }

  /*
   * 新增用户
   */
  @Post('add')
  @NoLogin
  async add(@Body() createStaffDto: CreateStaffDto): Promise<HttpResponse<any>> {
    // 校验用户名唯一
    // TODO

    // 生成随机的staffId
    const staffId = Utils.generateId('staff');
    const isActive = !!createStaffDto.isActive;
    const staff = {
      ...createStaffDto,
      staffId,
      isActive,
    };

    // 写入数据库
    const res = this.StaffService.create(staff);
    return resSuccess(res);
  }

  /*
   * 更新用户
   */
  @Post('get-detail')
  @NoLogin
  async getDetail(@Body() updateStaffDto: UpdateStaffDto): Promise<HttpResponse<any>> {
    const arr = this.StaffService.update(updateStaffDto);
    return resSuccess(arr);
  }
}
