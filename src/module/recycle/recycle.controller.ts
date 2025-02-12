import { Controller, Post, Body } from '@nestjs/common';
import ErrorCode from '../../constant/error-code';
import { resSuccess } from '../../utils/index';
import type { HttpResponse, ListResponse } from '../../types/type';
import { RecycleService } from './recycle.service';
import { GetListDto, GetDetailDto, DeleteRecycleDto } from './dto/recycle.dto';
import type { Recycle } from './recycle.entity';

@Controller('recycle')
export class RecycleController {
  constructor(private readonly RecycleService: RecycleService) {}

  /*
   * 查询回收项列表
   */
  @Post('get-list')
  async getList(@Body() getListDto: GetListDto): Promise<HttpResponse<ListResponse<Recycle>>> {
    const { items, total } = await this.RecycleService.getList({
      pageNo: getListDto.pageNo,
      pageSize: getListDto.pageSize,
      sortField: getListDto.sortField,
      sortOrder: getListDto.sortOrder,
      type: getListDto.type,
      content: getListDto.content,
      deleteStaffName: getListDto.deleteStaffName,
    });

    // 返回字段处理
    items.forEach((item) => {
      delete item.id;
      if (item.content.length > 100) {
        item.content = `${item.content.slice(0, 100)}...`;
      }
    });

    return resSuccess({
      pageNo: getListDto.pageNo,
      total: total,
      list: items,
    });
  }

  /*
   * 查询回收项详情
   */
  @Post('get-detail')
  async getDetail(@Body() getDetailDto: GetDetailDto): Promise<HttpResponse<any>> {
    const recycle = await this.RecycleService.getDetail(getDetailDto.recycleId);
    if (!recycle) {
      return {
        code: ErrorCode.RECYCLE_NOT_FOUND,
        message: '回收项不存在',
      };
    }

    // 返回字段处理
    delete recycle.id;

    return resSuccess(recycle);
  }

  /*
   * 删除回收项
   */
  @Post('delete')
  async delete(@Body() deleteRecycleDto: DeleteRecycleDto): Promise<HttpResponse<any>> {
    const recycle = await this.RecycleService.getDetail(deleteRecycleDto.recycleId);
    if (!recycle) {
      return {
        code: ErrorCode.RECYCLE_NOT_FOUND,
        message: '回收项不存在',
      };
    }

    await this.RecycleService.delete(deleteRecycleDto.recycleId);
    return resSuccess(null);
  }
}
