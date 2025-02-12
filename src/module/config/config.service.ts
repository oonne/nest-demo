import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utils } from '../../utils/index';
import { Config } from './config.entity';
import { Like } from 'typeorm';

const { generateId } = Utils;

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Config)
    private configRepository: Repository<Config>,
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
  }): Promise<{ items: Config[]; total: number }> {
    const [items, total] = await this.configRepository.findAndCount({
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
      order: {
        [sortField]: sortOrder,
      },
      where: {
        key: key ? Like(`%${key}%`) : undefined,
        value: value ? Like(`%${value}%`) : undefined,
        remark: remark ? Like(`%${remark}%`) : undefined,
      },
    });

    return {
      items,
      total,
    };
  }

  /* 根据configId查询单个 */
  getDetail(configId: string): Promise<Config> {
    return this.configRepository.findOneBy({ configId });
  }

  /* 根据key查询单个 */
  getDetailByKey(key: string): Promise<Config> {
    return this.configRepository.findOneBy({ key });
  }

  /* 新增 */
  async create(config: Partial<Config>): Promise<Config> {
    const configId = generateId('config');
    // 如果configId已存在，则重新生成
    if (await this.configRepository.findOneBy({ configId })) {
      return this.create(config);
    }

    const configToCreate = {
      ...config,
      configId,
    };

    return this.configRepository.save(configToCreate);
  }

  /* 更新 */
  async update(config: Partial<Config>): Promise<Config> {
    let configToUpdate = await this.configRepository.findOneBy({ configId: config.configId });
    if (!configToUpdate) {
      throw new Error('Config not found');
    }

    configToUpdate = {
      ...configToUpdate,
      ...config,
    };

    return this.configRepository.save(configToUpdate);
  }

  /* 删除 */
  async delete(configId: string): Promise<void> {
    await this.configRepository.delete({ configId });
  }
}
