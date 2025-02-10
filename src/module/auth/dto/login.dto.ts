import { IsString, Length } from 'class-validator';

/* 生成登录pow的盐和结果 */
export class GenerateLoginPowDto {
  @IsString()
  name: string;
}

/* 登录 */
export class LoginDto {
  @IsString()
  @Length(32, 32)
  powKey: string;

  @IsString()
  name: string;

  @IsString()
  password: string;
}
