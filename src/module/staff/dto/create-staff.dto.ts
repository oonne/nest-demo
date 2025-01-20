import { IsString, IsInt, IsBoolean } from 'class-validator';

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
