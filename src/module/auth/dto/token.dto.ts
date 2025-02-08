import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  staffId: string;

  @IsString()
  refreshToken: string;
}
