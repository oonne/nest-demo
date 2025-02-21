import { Controller, Post, Body, Req, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWriteStream, mkdirSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import { Roles } from '../../common/decorator/roles.decorator';
import ErrorCode from '../../constant/error-code';
import { resSuccess, Type } from '../../utils/index';
import type { HttpResponse, ListResponse } from '../../types/type';
import { GetListDto, GetDetailDto, DeleteFileDto } from './dto/file.dto';
import { FileService } from './file.service';
import type { File } from './file.entity';

const { isFile } = Type;

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private configService: ConfigService,
  ) {
    // 确保文件上传目录存在
    const uploadDir = join(process.cwd(), 'file_storage');
    if (!existsSync(uploadDir)) {
      const logger = new Logger();
      logger.log(`创建文件上传目录: ${uploadDir}`);
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
      fileSize: getListDto.fileSize,
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

    try {
      // 删除物理文件
      const filePath = join(process.cwd(), 'file_storage', file.fileName);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }

      // 删除数据库记录
      await this.fileService.delete(deleteFileDto.fileId);
      return resSuccess(null);
    } catch (error) {
      const logger = new Logger();
      logger.error('文件删除失败', error);
      return {
        code: ErrorCode.FILE_DELETE_FAILED,
        message: '文件删除失败',
      };
    }
  }

  /*
   * 上传文件
   */
  @Post('upload')
  @Roles([1])
  async upload(@Req() req: Request): Promise<HttpResponse<any>> {
    // 获取表单数据
    const formData = await req.formData();
    const suffix = String(formData.get('suffix') ?? '');
    const type = String(formData.get('type') ?? '');
    const fileMd5 = String(formData.get('fileMd5') ?? '');
    if (!fileMd5) {
      return {
        code: ErrorCode.FILE_MD5_ERROR,
        message: '文件MD5错误',
      };
    }
    const fileName = suffix ? `${fileMd5}.${suffix}` : fileMd5;

    // 判断文件是否存在，如果存在无须重新上传
    const repeatFile = await this.fileService.getDetailByFileName(fileName);
    if (repeatFile) {
      return {
        code: ErrorCode.FILE_EXISTS,
        message: '文件已存在',
      };
    }

    // 获取文件
    const file = formData.get('file');
    if (!isFile(file)) {
      return {
        code: ErrorCode.FILE_NOT_RECEIVED,
        message: '未收到上传的文件',
      };
    }

    try {
      // 保存文件到 file_storage
      const fileStream = file.stream();
      const filePath = join(process.cwd(), 'file_storage', fileName);
      await pipeline(fileStream, createWriteStream(filePath));

      // 保存文件信息到数据库
      const fileEntity = await this.fileService.create({
        type: type === 'file' ? 2 : 1,
        fileName: fileName,
        fileSize: file.size,
      });

      return resSuccess({
        fileName: fileEntity.fileName,
        fileSize: fileEntity.fileSize,
      });
    } catch (error) {
      const logger = new Logger();
      logger.error('文件上传失败', error);
      return {
        code: ErrorCode.FILE_UPLOAD_FAILED,
        message: '文件上传失败',
      };
    }
  }
}
