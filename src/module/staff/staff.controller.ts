import { Controller, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { NoLogin } from '../../common/decorator/auth.decorator';
import ErrorCode from '../../constant/error-code';
import { resSuccess } from '../../utils/index';
import { HttpResponse, ListResponse } from '../../types/type';
import { StaffService } from './staff.service';
import {
  GetListDto,
  GetDetailDto,
  CreateStaffDto,
  UpdateStaffDto,
  DeleteStaffDto,
} from './dto/staff.dto';
import { Staff } from './staff.entity';

@Controller('staff')
export class StaffController {
  constructor(
    private readonly StaffService: StaffService,
    private configService: ConfigService,
  ) {}

  /*
   * 查询账号列表
   */
  @Post('get-list')
  async getList(@Body() getListDto: GetListDto): Promise<HttpResponse<ListResponse<Staff>>> {
    const { items, total } = await this.StaffService.getList({
      pageNo: getListDto.pageNo,
      pageSize: getListDto.pageSize,
      sortField: getListDto.sortField,
      sortOrder: getListDto.sortOrder,
      name: getListDto.name,
      role: getListDto.role,
      isActive: getListDto.isActive,
    });

    // 过滤不显示的字段
    items.forEach((item) => {
      delete item.id;
      delete item.password;
      delete item.refreshToken;
      delete item.loginPowSalt;
      delete item.loginPowResult;
    });

    // 返回
    return resSuccess({
      pageNo: getListDto.pageNo,
      total: total,
      list: items,
    });
  }

  /*
   * 根据staffId查询单个
   */
  @Post('get-detail')
  async getDetail(@Body() getDetailDto: GetDetailDto): Promise<HttpResponse<any>> {
    const staff = await this.StaffService.getDetail(getDetailDto.staffId);
    if (!staff) {
      return {
        code: ErrorCode.STAFF_NOT_FOUND,
        message: '账号不存在',
      };
    }

    // 过滤不显示的字段
    delete staff.id;
    delete staff.password;
    delete staff.refreshToken;
    delete staff.loginPowSalt;
    delete staff.loginPowResult;

    return resSuccess(staff);
  }

  /*
   * 新增账号
   */
  @Post('add')
  async add(@Body() createStaffDto: CreateStaffDto): Promise<HttpResponse<any>> {
    // 校验用户名唯一
    const sameNameStaff = await this.StaffService.getDetailByName(createStaffDto.name);
    if (sameNameStaff) {
      return {
        code: ErrorCode.STAFF_NAME_UNIQUE,
        message: '账号名已存在',
      };
    }

    // 写入数据库
    const res = this.StaffService.create(createStaffDto);
    return resSuccess(res);
  }

  /*
   * 更新账号
   */
  @Post('update')
  async update(@Body() updateStaffDto: UpdateStaffDto): Promise<HttpResponse<any>> {
    const staff = await this.StaffService.getDetail(updateStaffDto.staffId);
    if (!staff) {
      return {
        code: ErrorCode.STAFF_NOT_FOUND,
        message: '账号不存在',
      };
    }

    const arr = this.StaffService.update(updateStaffDto);
    return resSuccess(arr);
  }

  /*
   * 删除账号
   */
  @Post('delete')
  async delete(@Body() deleteStaffDto: DeleteStaffDto): Promise<HttpResponse<any>> {
    const staff = await this.StaffService.getDetail(deleteStaffDto.staffId);
    if (!staff) {
      return {
        code: ErrorCode.STAFF_NOT_FOUND,
        message: '账号不存在',
      };
    }

    const res = await this.StaffService.delete(deleteStaffDto.staffId);
    return resSuccess(res);
  }
}
