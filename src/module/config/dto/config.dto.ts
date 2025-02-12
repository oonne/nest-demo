import { IsString, IsOptional, IsIn, IsInt } from 'class-validator';

/* 查询配置列表 */
export class GetListDto {
  @IsInt()
  pageNo: number;

  @IsInt()
  pageSize: number;

  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsString()
  sortField?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;
}

/* 查询单个配置 */
export class GetDetailDto {
  @IsString()
  configId: string;
}

/* 新建配置 */
export class CreateConfigDto {
  @IsString()
  key: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  remark?: string;
}

/* 更新配置 */
export class UpdateConfigDto {
  @IsString()
  configId: string;

  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsString()
  remark?: string;
}

/* 删除配置 */
export class DeleteConfigDto {
  @IsString()
  configId: string;
}
