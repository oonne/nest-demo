import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from './staff.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  /*
   * 查询全部
   */
  getList(): Promise<Staff[]> {
    // TODO：分页
    // TODO: 筛选/搜索
    // TODO：排序
    return this.staffRepository.find();
  }

  /* 查询单个 */
  getDetail(staffId: string): Promise<Staff> {
    return this.staffRepository.findOneBy({ staffId: staffId });
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
  async remove(staffId: string): Promise<void> {
    await this.staffRepository.delete({ staffId });
  }
}
