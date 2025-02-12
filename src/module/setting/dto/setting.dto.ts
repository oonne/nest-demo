import { IsString, IsOptional, IsIn, IsInt } from 'class-validator';

/* 查询设置列表 */
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

/* 查询单个设置 */
export class GetDetailDto {
  @IsString()
  settingId: string;
}

/* 新建设置 */
export class CreateSettingDto {
  @IsString()
  key: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  remark?: string;
}

/* 更新设置 */
export class UpdateSettingDto {
  @IsString()
  settingId: string;

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

/* 删除设置 */
export class DeleteSettingDto {
  @IsString()
  settingId: string;
}
