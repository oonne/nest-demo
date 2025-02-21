import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utils, Condition } from '../../utils/index';
import { File } from './file.entity';

const { generateId } = Utils;
const { getStringCondition, getNumberCondition } = Condition;
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
    const [items, total] = await this.fileRepository.findAndCount({
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
      order: {
        [sortField]: sortOrder,
      },
      where: {
        type: type || undefined,
        fileName: getStringCondition(fileName),
        fileSize: getNumberCondition(fileSize),
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
