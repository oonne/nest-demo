import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utils } from '../../utils/index';
import { Recycle } from './recycle.entity';
import { Like, In } from 'typeorm';

const { generateId } = Utils;

@Injectable()
export class RecycleService {
  constructor(
    @InjectRepository(Recycle)
    private recycleRepository: Repository<Recycle>,
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
    content,
    deleteStaffName,
  }: {
    pageNo?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    type?: number[];
    content?: string;
    deleteStaffName?: string;
  }): Promise<{ items: Recycle[]; total: number }> {
    const [items, total] = await this.recycleRepository.findAndCount({
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
      order: {
        [sortField]: sortOrder,
      },
      where: {
        type: type?.length ? In(type) : undefined,
        content: content ? Like(`%${content}%`) : undefined,
        deleteStaffName: deleteStaffName ? Like(`%${deleteStaffName}%`) : undefined,
      },
    });

    return {
      items,
      total,
    };
  }

  /* 根据recycleId查询单个 */
  getDetail(recycleId: string): Promise<Recycle> {
    return this.recycleRepository.findOneBy({ recycleId });
  }

  /* 新增 */
  async create(recycle: Partial<Recycle>): Promise<Recycle> {
    const recycleId = generateId('recycle');
    // 如果recycleId已存在，则重新生成
    if (await this.recycleRepository.findOneBy({ recycleId })) {
      return this.create(recycle);
    }

    // 获取当前账号 TODO

    const recycleToCreate = {
      ...recycle,
      recycleId,
      deleteStaffId: '占位',
      deleteStaffName: '占位',
    };

    return this.recycleRepository.save(recycleToCreate);
  }

  /* 删除 */
  async delete(recycleId: string): Promise<void> {
    await this.recycleRepository.delete({ recycleId });
  }
}
