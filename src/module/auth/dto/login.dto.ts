import { IsString } from 'class-validator';

/* 生成登录pow的盐和结果 */
export class GenerateLoginPowDto {
  @IsString()
  name: string;
}

/* 登录 */
export class LoginDto {
  @IsString()
  name: string;

  @IsString()
  password: string;
}
