import * as CryptoJS from 'crypto-js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import config from '../../config';
import { Utils } from '../../utils/index';
import { Staff } from './staff.entity';
import { Like, In } from 'typeorm';

const { passwordIterations } = config;
const { generateId, randomChars, createHash } = Utils;
@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  /*
   * 密码加盐哈希
   * (以id为盐，进行PBKDF2运算)
   */
  hashPassword(password: string, id: string): string {
    const key = CryptoJS.PBKDF2(password, id, {
      keySize: 512 / 32,
      iterations: passwordIterations,
    });

    return key.toString(CryptoJS.enc['Hex']);
  }

  /*
   * 校验refreshToken
   */
  async verifyRefreshToken({
    staffId,
    refreshToken,
  }: {
    staffId: string;
    refreshToken: string;
  }): Promise<boolean> {
    const staff = await this.staffRepository.findOneBy({ staffId });
    if (!staff) {
      return false;
    }
    return staff.refreshToken === refreshToken;
  }

  /*
   * 更新refreshToken
   */
  async generateRefreshToken(staffId: string): Promise<string> {
    const staff = await this.staffRepository.findOneBy({ staffId });
    if (!staff) {
      return '';
    }

    const refreshToken = createHash(randomChars(32), 32);
    await this.staffRepository.save({
      ...staff,
      refreshToken,
    });
    return refreshToken;
  }

  /*
   * 查询列表
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
  create(staff: Partial<Staff>): Promise<Staff> {
    // 生成随机的staffId
    const staffId = generateId('staff');
    const staffToCreate = {
      ...staff,
      staffId,
      password: this.hashPassword(staff.password, staffId),
    };

    return this.staffRepository.save(staffToCreate);
  }

  /* 更新 */
  async update(staff: Partial<Staff>): Promise<Staff> {
    let staffToUpdate = await this.staffRepository.findOneBy({ staffId: staff.staffId });
    if (!staffToUpdate) {
      throw new Error('Staff not found');
    }
    staffToUpdate = {
      ...staffToUpdate,
      ...staff,
    };
    if (staff.password) {
      staffToUpdate.password = this.hashPassword(staff.password, staffToUpdate.staffId);
    }
    return this.staffRepository.save(staffToUpdate);
  }

  /* 删除 */
  async delete(staffId: string): Promise<void> {
    await this.staffRepository.delete({ staffId });
  }
}
