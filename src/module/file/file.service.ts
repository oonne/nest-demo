import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, LessThan, Repository } from 'typeorm';
import { Utils } from '../../utils/index';
import { File } from './file.entity';

const { generateId } = Utils;

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  /*
   * 查询列表
   */
  async getList({
    pageNo = 1,
    pageSize = 10,
    sortField = 'createdAt',
    sortOrder = 'desc',
    type,
    fileName,
    fileSize,
  }: {
    pageNo?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    fileName?: string;
    type?: number;
    fileSize?: string;
  }): Promise<{ items: File[]; total: number }> {
    let fileSizeCondition = undefined;
    if (fileSize) {
      if (fileSize.startsWith('=')) {
        fileSizeCondition = Number(fileSize.substring(1));
      } else if (fileSize.startsWith('>')) {
        fileSizeCondition = MoreThan(Number(fileSize.substring(1)));
      } else if (fileSize.startsWith('<')) {
        fileSizeCondition = LessThan(Number(fileSize.substring(1)));
      } else {
        fileSizeCondition = Like(`%${fileSize}%`);
      }
    }

    const [items, total] = await this.fileRepository.findAndCount({
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
      order: {
        [sortField]: sortOrder,
      },
      where: {
        type: type || undefined,
        fileName: fileName ? Like(`%${fileName}%`) : undefined,
        fileSize: fileSizeCondition,
      },
    });

    return {
      items,
      total,
    };
  }

  /*
   * 根据fileId查询单个
   */
  getDetail(fileId: string): Promise<File> {
    return this.fileRepository.findOneBy({ fileId });
  }

  /*
   * 根据fileName查询单个
   */
  getDetailByFileName(fileName: string): Promise<File> {
    return this.fileRepository.findOneBy({ fileName });
  }

  /*
   * 新增
   */
  async create(file: Partial<File>): Promise<File> {
    const fileId = generateId('file');
    if (await this.fileRepository.findOneBy({ fileId })) {
      return this.create(file);
    }

    const fileToCreate = {
      ...file,
      fileId,
    };

    return this.fileRepository.save(fileToCreate);
  }

  /*
   * 删除
   */
  async delete(fileId: string): Promise<void> {
    await this.fileRepository.delete({ fileId });
  }
}
