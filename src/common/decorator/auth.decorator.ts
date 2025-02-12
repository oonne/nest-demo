import { SetMetadata } from '@nestjs/common';

/* 
 * 不校验登录态装饰器。
 * 用法示例:
  @Post()
  @NoLogin
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }
 */
export const NoLogin = SetMetadata('noLogin', true);
