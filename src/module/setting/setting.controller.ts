import { Controller, Post, Body, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Roles } from '../../common/decorator/roles.decorator';
import ErrorCode from '../../constant/error-code';
import { resSuccess } from '../../utils/index';
import type { HttpResponse, ListResponse } from '../../types/type';
import { RecycleService } from '../recycle/recycle.service';
import { SettingService } from './setting.service';
import {
  GetListDto,
  GetDetailDto,
  CreateSettingDto,
  UpdateSettingDto,
  DeleteSettingDto,
} from './dto/setting.dto';
import type { Setting } from './setting.entity';

@Controller('setting')
export class SettingController {
  constructor(
    private readonly settingService: SettingService,
    private readonly RecycleService: RecycleService,
    private configService: ConfigService,
  ) {}

  /*
   * 查询设置列表
   */
  @Post('get-list')
  @Roles([1])
  async getList(@Body() getListDto: GetListDto): Promise<HttpResponse<ListResponse<Setting>>> {
    const { items, total } = await this.settingService.getList({
      pageNo: getListDto.pageNo,
      pageSize: getListDto.pageSize,
      sortField: getListDto.sortField,
      sortOrder: getListDto.sortOrder,
      key: getListDto.key,
      value: getListDto.value,
      remark: getListDto.remark,
    });

    // 返回字段处理
    items.forEach((item) => {
      delete item.id;
      if (item.value.length > 100) {
        item.value = `${item.value.slice(0, 100)}...`;
      }
      if (item.remark.length > 100) {
        item.remark = `${item.remark.slice(0, 100)}...`;
      }
    });

    return resSuccess({
      pageNo: getListDto.pageNo,
      total: total,
      list: items,
    });
  }

  /*
   * 查询设置详情
   */
  @Post('get-detail')
  @Roles([1])
  async getDetail(@Body() getDetailDto: GetDetailDto): Promise<HttpResponse<any>> {
    const setting = await this.settingService.getDetail(getDetailDto.settingId);
    if (!setting) {
      return {
        code: ErrorCode.SETTING_NOT_FOUND,
        message: '设置不存在',
      };
    }

    // 返回字段处理
    delete setting.id;

    return resSuccess(setting);
  }

  /*
   * 新增设置
   */
  @Post('add')
  @Roles([1])
  async add(@Body() createSettingDto: CreateSettingDto): Promise<HttpResponse<any>> {
    const sameKeySetting = await this.settingService.getDetailByKey(createSettingDto.key);
    if (sameKeySetting) {
      return {
        code: ErrorCode.SETTING_KEY_UNIQUE,
        message: '设置键必须唯一',
      };
    }

    const res = await this.settingService.create(createSettingDto);
    return resSuccess(res);
  }

  /*
   * 更新设置
   */
  @Post('update')
  @Roles([1])
  async update(@Body() updateSettingDto: UpdateSettingDto): Promise<HttpResponse<any>> {
    const setting = await this.settingService.getDetail(updateSettingDto.settingId);
    if (!setting) {
      return {
        code: ErrorCode.SETTING_NOT_FOUND,
        message: '设置不存在',
      };
    }

    if (updateSettingDto.key && updateSettingDto.key !== setting.key) {
      const sameKeySetting = await this.settingService.getDetailByKey(updateSettingDto.key);
      if (sameKeySetting) {
        return {
          code: ErrorCode.SETTING_KEY_UNIQUE,
          message: '设置键必须唯一',
        };
      }
    }

    const res = await this.settingService.update(updateSettingDto);
    return resSuccess(res);
  }

  /*
   * 删除设置
   */
  @Post('delete')
  @Roles([1])
  async delete(
    @Body() deleteSettingDto: DeleteSettingDto,
    @Req() req: Request,
  ): Promise<HttpResponse<any>> {
    const setting = await this.settingService.getDetail(deleteSettingDto.settingId);
    if (!setting) {
      return {
        code: ErrorCode.SETTING_NOT_FOUND,
        message: '设置不存在',
      };
    }

    // 加入到回收站
    const content = `
      设置ID: ${setting.settingId}
      设置key: ${setting.key}
      设置value: ${setting.value}
      设置备注: ${setting.remark}
    `;
    const recycle = await this.RecycleService.create({
      type: 2,
      content,
      deleteStaffId: req['staff']?.staffId,
    });
    if (!recycle) {
      return {
        code: ErrorCode.RECYCLE_FAILED,
        message: '回收失败',
      };
    }

    await this.settingService.delete(deleteSettingDto.settingId);
    return resSuccess(null);
  }
}
