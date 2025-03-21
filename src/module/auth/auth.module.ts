import { Module } from '@nestjs/common';
import { JwtModule } from '../jwt/jwt.module';
import { StaffModule } from '../staff/staff.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [StaffModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
