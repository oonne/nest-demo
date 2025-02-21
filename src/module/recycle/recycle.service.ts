import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Utils, Condition } from '../../utils/index';
import { StaffService } from '../staff/staff.service';
import { Recycle } from './recycle.entity';

const { generateId } = Utils;
const { getStringCondition } = Condition;

@Injectable()
export class RecycleService {
  constructor(
    @InjectRepository(Recycle)
    private recycleRepository: Repository<Recycle>,
    private staffService: StaffService,
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
        content: getStringCondition(content),
        deleteStaffName: getStringCondition(deleteStaffName),
      },
    });

    return {
      items,
      total,
    };
  }

  /*
   * 根据recycleId查询单个
   */
  getDetail(recycleId: string): Promise<Recycle> {
    return this.recycleRepository.findOneBy({ recycleId });
  }

  /*
   * 新增
   */
  async create(recycle: Partial<Recycle>): Promise<Recycle> {
    const recycleId = generateId('recycle');
    // 如果recycleId已存在，则重新生成
    if (await this.recycleRepository.findOneBy({ recycleId })) {
      return this.create(recycle);
    }

    // 获取删除者账号
    const deleteStaffId = recycle.deleteStaffId ?? '';
    let deleteStaffName = '';
    if (deleteStaffId) {
      const staff = await this.staffService.getDetail(deleteStaffId);
      if (staff) {
        deleteStaffName = staff.name;
      }
    }

    const recycleToCreate = {
      ...recycle,
      recycleId,
      deleteStaffId,
      deleteStaffName,
    };

    return this.recycleRepository.save(recycleToCreate);
  }

  /*
   * 删除
   */
  async delete(recycleId: string): Promise<void> {
    await this.recycleRepository.delete({ recycleId });
  }
}
