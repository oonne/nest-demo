import { IsString, IsInt, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsInt()
  role: number;

  @IsBoolean()
  isActive: boolean;
}
