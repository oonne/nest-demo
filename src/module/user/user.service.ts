import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /*
   * 查询全部
   */
  findAll(): Promise<User[]> {
    // TODO：分页
    // TODO: 筛选/搜索
    // TODO：排序
    return this.usersRepository.find();
  }

  /* 查询单个 */
  findOne(userId: string): Promise<User> {
    return this.usersRepository.findOneBy({ userId: userId });
  }

  /* 新增 */
  create(user: Partial<User>): Promise<User> {
    return this.usersRepository.save(user);
  }

  /* 更新 */
  async update(user: User): Promise<User> {
    const userToUpdate = await this.usersRepository.findOneBy({ userId: user.userId });
    if (!userToUpdate) {
      throw new Error('User not found');
    }
    return this.usersRepository.save({ ...userToUpdate, ...user });
  }

  /* 删除 */
  async remove(userId: string): Promise<void> {
    await this.usersRepository.delete({ userId });
  }
}
