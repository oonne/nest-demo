import { IsString, IsIn, IsBoolean, IsOptional } from 'class-validator';
import { roleKeyArr } from '../../../constant/role';

/* 新建 staff 的校验 */
export class CreateStaffDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsIn(roleKeyArr)
  role: number;

  @IsBoolean()
  isActive?: boolean;
}

/* 更新 staff 的校验 */
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
