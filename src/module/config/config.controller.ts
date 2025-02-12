import { Controller, Post, Body } from '@nestjs/common';
import { Roles } from '../../common/decorator/roles.decorator';
import ErrorCode from '../../constant/error-code';
import { resSuccess } from '../../utils/index';
import { HttpResponse, ListResponse } from '../../types/type';
import { ConfigService } from './config.service';
import {
  GetListDto,
  GetDetailDto,
  CreateConfigDto,
  UpdateConfigDto,
  DeleteConfigDto,
} from './dto/config.dto';
import { Config } from './config.entity';

@Controller('config')
export class ConfigController {
  constructor(private readonly ConfigService: ConfigService) {}

  /*
   * 查询设置列表
   */
  @Post('get-list')
  @Roles([1])
  async getList(@Body() getListDto: GetListDto): Promise<HttpResponse<ListResponse<Config>>> {
    const { items, total } = await this.ConfigService.getList({
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
    const config = await this.ConfigService.getDetail(getDetailDto.configId);
    if (!config) {
      return {
        code: ErrorCode.SETTING_NOT_FOUND,
        message: '设置不存在',
      };
    }

    // 返回字段处理
    delete config.id;

    return resSuccess(config);
  }

  /*
   * 新增设置
   */
  @Post('add')
  @Roles([1])
  async add(@Body() createConfigDto: CreateConfigDto): Promise<HttpResponse<any>> {
    // 校验key唯一
    const sameKeyConfig = await this.ConfigService.getDetailByKey(createConfigDto.key);
    if (sameKeyConfig) {
      return {
        code: ErrorCode.SETTING_KEY_UNIQUE,
        message: '设置键必须唯一',
      };
    }

    const res = await this.ConfigService.create(createConfigDto);

    return resSuccess(res);
  }

  /*
   * 更新设置
   */
  @Post('update')
  @Roles([1])
  async update(@Body() updateConfigDto: UpdateConfigDto): Promise<HttpResponse<any>> {
    const config = await this.ConfigService.getDetail(updateConfigDto.configId);
    if (!config) {
      return {
        code: ErrorCode.SETTING_NOT_FOUND,
        message: '设置不存在',
      };
    }

    // 如果修改了key，校验唯一性
    if (updateConfigDto.key && updateConfigDto.key !== config.key) {
      const sameKeyConfig = await this.ConfigService.getDetailByKey(updateConfigDto.key);
      if (sameKeyConfig) {
        return {
          code: ErrorCode.SETTING_KEY_UNIQUE,
          message: '设置键必须唯一',
        };
      }
    }

    const res = await this.ConfigService.update(updateConfigDto);

    return resSuccess(res);
  }

  /*
   * 删除设置
   */
  @Post('delete')
  @Roles([1])
  async delete(@Body() deleteConfigDto: DeleteConfigDto): Promise<HttpResponse<any>> {
    const config = await this.ConfigService.getDetail(deleteConfigDto.configId);
    if (!config) {
      return {
        code: ErrorCode.SETTING_NOT_FOUND,
        message: '设置不存在',
      };
    }

    // 删除
    await this.ConfigService.delete(deleteConfigDto.configId);
    return resSuccess(null);
  }
}
