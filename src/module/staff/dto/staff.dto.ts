import { IsInt, IsArray, IsString, IsIn, IsBoolean, IsOptional } from 'class-validator';
import { roleKeyArr } from '../../../constant/role';

/* 查询staff列表 */
export class GetListDto {
  @IsInt()
  pageNo: number;

  @IsInt()
  pageSize: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsIn(roleKeyArr, { each: true })
  role?: number[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  sortField?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;
}

/* 查询单个 staff */
export class GetDetailDto {
  @IsString()
  staffId: string;
}

/* 更新 refreshToken */
export class UpdateRefreshTokenDto {
  @IsString()
  staffId: string;
}

/* 新建 staff */
export class CreateStaffDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsIn(roleKeyArr)
  role: number;

  @IsBoolean()
  isActive?: boolean;
}

/* 更新 staff */
export class UpdateStaffDto {
  @IsString()
  staffId: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsIn(roleKeyArr)
  role: number;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}

/* 删除 staff */
export class DeleteStaffDto {
  @IsString()
  staffId: string;
}
