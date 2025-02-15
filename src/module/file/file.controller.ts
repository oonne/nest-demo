import { Controller, Post, Body, UseInterceptors, UploadedFile, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import type { MultipartFile } from '@fastify/multipart';
import { Roles } from '../../common/decorator/roles.decorator';
import ErrorCode from '../../constant/error-code';
import { resSuccess } from '../../utils/index';
import { FastifyFileInterceptor } from '../../common/interceptors/fastify-file.interceptor';
import type { HttpResponse, ListResponse } from '../../types/type';
import { GetListDto, GetDetailDto, DeleteFileDto } from './dto/file.dto';
import { FileService } from './file.service';
import type { File } from './file.entity';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private configService: ConfigService,
  ) {
    // 确保文件上传目录存在
    const uploadDir = join(process.cwd(), 'files_storage');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }
  }

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

  /*
   * 上传文件
   */
  @Post('upload')
  @Roles([1])
  @UseInterceptors(FastifyFileInterceptor('file'))
  async upload(@UploadedFile() file: MultipartFile): Promise<HttpResponse<any>> {
    if (!file) {
      return {
        code: ErrorCode.FILE_NOT_RECEIVED,
        message: '未收到上传的文件',
      };
    }
    const logger = new Logger();

    try {
      const fileName = `${Date.now()}-${file.filename}`;
      const filePath = join(process.cwd(), 'files_storage', fileName);

      await pipeline(file.file, createWriteStream(filePath));

      // 保存文件信息到数据库
      const fileEntity = await this.fileService.create({
        type: 1,
        fileName: file.filename,
        fileSize: file.file.bytesRead,
      });

      return resSuccess({
        fileName: fileEntity.fileName,
        fileSize: fileEntity.fileSize,
      });
    } catch (error) {
      logger.error('文件上传失败', error);
      return {
        code: ErrorCode.FILE_UPLOAD_FAILED,
        message: '文件上传失败',
      };
    }
  }
}
