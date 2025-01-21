import { IsString, IsInt, IsBoolean } from 'class-validator';

/* 新建 staff 的校验 */
export class CreateStaffDto {
  @IsString()
  staffId: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsInt()
  role: number;

  @IsBoolean()
  isActive: boolean;
}

/* 更新 staff 的校验 */
export class UpdateStaffDto {
  @IsString()
  staffId: string;

  @IsString()
  name?: string;

  @IsString()
  password?: string;

  @IsInt()
  role?: number;

  @IsBoolean()
  isActive?: boolean;
}
