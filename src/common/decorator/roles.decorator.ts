/* 
 * 角色校验装饰器。 只有符合角色列表中的角色才能访问。
 * 用法示例:
  @Post()
  @Roles([1, 2])
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }
 */
import { SetMetadata } from '@nestjs/common';

export const Roles = (roles: number[]) => SetMetadata('roles', roles);
