import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Utils, Condition } from '../../utils/index';
import { Setting } from './setting.entity';

const { generateId } = Utils;
const { getStringCondition } = Condition;

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /*
   * 查询列表
   */
  async getList({
    pageNo = 1,
    pageSize = 10,
    sortField = 'createdAt',
    sortOrder = 'desc',
    key,
    value,
    remark,
  }: {
    pageNo?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    key?: string;
    value?: string;
    remark?: string;
  }): Promise<{ items: Setting[]; total: number }> {
    const [items, total] = await this.settingRepository.findAndCount({
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
      order: {
        [sortField]: sortOrder,
      },
      where: {
        key: getStringCondition(key),
        value: getStringCondition(value),
        remark: getStringCondition(remark),
      },
    });

    return {
      items,
      total,
    };
  }

  /*
   * 根据settingId查询单个
   */
  getDetail(settingId: string): Promise<Setting> {
    return this.settingRepository.findOneBy({ settingId });
  }

  /*
   * 根据key查询单个
   */
  async getDetailByKey(key: string): Promise<string> {
    // 从缓存中获取
    const value: string = await this.cacheManager.get(key);
    if (value) {
      return value;
    }

    // 读取数据库并写入缓存
    const setting = await this.settingRepository.findOneBy({ key });
    if (setting) {
      await this.cacheManager.set(key, setting.value || '', 0);
      return setting.value;
    }

    // 如果数据库中没有，则返回空
    return null;
  }

  /*
   * 新增
   */
  async create(setting: Partial<Setting>): Promise<Setting> {
    const settingId = generateId('setting');
    if (await this.settingRepository.findOneBy({ settingId })) {
      return this.create(setting);
    }

    const settingToCreate = {
      ...setting,
      settingId,
    };

    // 写入缓存
    await this.cacheManager.set(setting.key, setting.value || '', 0);

    return this.settingRepository.save(settingToCreate);
  }

  /*
   * 更新
   */
  async update(setting: Partial<Setting>): Promise<Setting> {
    let settingToUpdate = await this.settingRepository.findOneBy({ settingId: setting.settingId });
    if (!settingToUpdate) {
      throw new Error('Setting not found');
    }

    settingToUpdate = {
      ...settingToUpdate,
      ...setting,
    };

    // 写入缓存
    await this.cacheManager.set(setting.key, setting.value || '', 0);

    return this.settingRepository.save(settingToUpdate);
  }

  /*
   * 删除
   */
  async delete(settingId: string): Promise<void> {
    const setting = await this.settingRepository.findOneBy({ settingId });
    if (!setting) {
      throw new Error('Setting not found');
    }

    // 删除缓存
    await this.cacheManager.del(setting.key);
    // 删除
    await this.settingRepository.delete({ settingId });
  }
}
