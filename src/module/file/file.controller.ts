import { Controller, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Roles } from '../../common/decorator/roles.decorator';
import ErrorCode from '../../constant/error-code';
import { resSuccess } from '../../utils/index';
import type { HttpResponse, ListResponse } from '../../types/type';
import { GetListDto, GetDetailDto, DeleteFileDto } from './dto/file.dto';
import { FileService } from './file.service';
import type { File } from './file.entity';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private configService: ConfigService,
  ) {}

  /*
   * 查询列表
   */
  @Post('get-list')
  @Roles([1])
  async getList(@Body() getListDto: GetListDto): Promise<HttpResponse<ListResponse<File>>> {
    const { items, total } = await this.fileService.getList({
      pageNo: getListDto.pageNo,
      pageSize: getListDto.pageSize,
      sortField: getListDto.sortField,
      sortOrder: getListDto.sortOrder,
      type: getListDto.type,
      fileName: getListDto.fileName,
    });

    // 返回字段处理
    items.forEach((item) => {
      delete item.id;
    });

    return resSuccess({
      pageNo: getListDto.pageNo,
      total: total,
      list: items,
    });
  }

  /*
   * 查询单个
   */
  @Post('get-detail')
  @Roles([1])
  async getDetail(@Body() getDetailDto: GetDetailDto): Promise<HttpResponse<any>> {
    const file = await this.fileService.getDetail(getDetailDto.fileId);
    if (!file) {
      return {
        code: ErrorCode.FILE_NOT_FOUND,
        message: '文件不存在',
      };
    }

    return resSuccess(file);
  }

  /*
   * 删除
   */
  @Post('delete')
  @Roles([1])
  async delete(@Body() deleteFileDto: DeleteFileDto): Promise<HttpResponse<any>> {
    const file = await this.fileService.getDetail(deleteFileDto.fileId);
    if (!file) {
      return {
        code: ErrorCode.FILE_NOT_FOUND,
        message: '文件不存在',
      };
    }

    await this.fileService.delete(deleteFileDto.fileId);
    return resSuccess(null);
  }
}
