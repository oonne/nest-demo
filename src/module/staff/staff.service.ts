import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from './staff.entity';
import { Like, In } from 'typeorm';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  /*
   * 查询全部(支持分页)
   */
  async getList({
    pageNo = 1,
    pageSize = 10,
    sortField = 'createdAt',
    sortOrder = 'desc',
    name,
    role,
    isActive,
  }: {
    pageNo?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    name?: string;
    role?: number[];
    isActive?: boolean;
  }): Promise<{ items: Staff[]; total: number }> {
    const [items, total] = await this.staffRepository.findAndCount({
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
      order: {
        [sortField]: sortOrder,
      },
      where: {
        name: name ? Like(`%${name}%`) : undefined,
        role: role?.length ? In(role) : undefined,
        isActive: isActive,
      },
    });

    return {
      items,
      total,
    };
  }

  /* 根据staffId查询单个 */
  getDetail(staffId: string): Promise<Staff> {
    return this.staffRepository.findOneBy({ staffId: staffId });
  }

  /* 根据name查询单个 */
  getDetailByName(name: string): Promise<Staff> {
    return this.staffRepository.findOneBy({ name: name });
  }

  /* 新增 */
  create(user: Partial<Staff>): Promise<Staff> {
    return this.staffRepository.save(user);
  }

  /* 更新 */
  async update(user: Partial<Staff>): Promise<Staff> {
    const userToUpdate = await this.staffRepository.findOneBy({ staffId: user.staffId });
    if (!userToUpdate) {
      throw new Error('Staff not found');
    }
    return this.staffRepository.save({ ...userToUpdate, ...user });
  }

  /* 删除 */
  async delete(staffId: string): Promise<void> {
    await this.staffRepository.delete({ staffId });
  }
}
