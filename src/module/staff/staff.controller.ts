import { Controller, Post, Body, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Roles } from '../../common/decorator/roles.decorator';
import ErrorCode from '../../constant/error-code';
import { roleList } from '../../constant/role';
import { resSuccess } from '../../utils/index';
import type { HttpResponse, ListResponse } from '../../types/type';
import { RecycleService } from '../recycle/recycle.service';
import { StaffService } from './staff.service';
import {
  GetListDto,
  GetDetailDto,
  UpdateRefreshTokenDto,
  CreateStaffDto,
  UpdateStaffDto,
  DeleteStaffDto,
} from './dto/staff.dto';
import type { Staff } from './staff.entity';

@Controller('staff')
export class StaffController {
  constructor(
    private readonly StaffService: StaffService,
    private readonly RecycleService: RecycleService,
    private configService: ConfigService,
  ) {}

  /*
   * 查询账号列表
   */
  @Post('get-list')
  @Roles([1])
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

    // 返回字段处理
    items.forEach((item) => {
      delete item.id;
      delete item.password;
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
  @Roles([1])
  async getDetail(@Body() getDetailDto: GetDetailDto): Promise<HttpResponse<any>> {
    const staff = await this.StaffService.getDetail(getDetailDto.staffId);
    if (!staff) {
      return {
        code: ErrorCode.STAFF_NOT_FOUND,
        message: '账号不存在',
      };
    }

    // 返回字段处理
    delete staff.id;
    delete staff.password;
    delete staff.loginPowSalt;
    delete staff.loginPowResult;

    return resSuccess(staff);
  }

  /*
   * 更新refreshToken
   */
  @Post('update-refresh-token')
  @Roles([1])
  async updateRefreshToken(
    @Body() updateRefreshTokenDto: UpdateRefreshTokenDto,
  ): Promise<HttpResponse<any>> {
    const res = await this.StaffService.generateRefreshToken(updateRefreshTokenDto.staffId);
    return resSuccess(res);
  }

  /*
   * 新增账号
   */
  @Post('add')
  @Roles([1])
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
  @Roles([1])
  async update(@Body() updateStaffDto: UpdateStaffDto): Promise<HttpResponse<any>> {
    const staff = await this.StaffService.getDetail(updateStaffDto.staffId);
    if (!staff) {
      return {
        code: ErrorCode.STAFF_NOT_FOUND,
        message: '账号不存在',
      };
    }

    // 校验用户名唯一
    if (updateStaffDto.name && updateStaffDto.name !== staff.name) {
      const sameNameStaff = await this.StaffService.getDetailByName(updateStaffDto.name);
      if (sameNameStaff) {
        return {
          code: ErrorCode.STAFF_NAME_UNIQUE,
          message: '账号名已存在',
        };
      }
    }

    const res = await this.StaffService.update(updateStaffDto);
    return resSuccess(res);
  }

  /*
   * 删除账号
   */
  @Post('delete')
  @Roles([1])
  async delete(
    @Body() deleteStaffDto: DeleteStaffDto,
    @Req() req: Request,
  ): Promise<HttpResponse<any>> {
    const staff = await this.StaffService.getDetail(deleteStaffDto.staffId);
    if (!staff) {
      return {
        code: ErrorCode.STAFF_NOT_FOUND,
        message: '账号不存在',
      };
    }

    // 加入到回收站
    const role = roleList.find((item) => item.key === staff.role);
    const content = `
      账号ID: ${staff.staffId}
      账号名: ${staff.name}
      账号角色: ${role.name}
    `;
    const recycle = await this.RecycleService.create({
      type: 1,
      content,
      deleteStaffId: req['staff']?.staffId,
    });
    if (!recycle) {
      return {
        code: ErrorCode.RECYCLE_FAILED,
        message: '回收失败',
      };
    }

    // 删除
    await this.StaffService.delete(deleteStaffDto.staffId);
    return resSuccess(null);
  }
}
