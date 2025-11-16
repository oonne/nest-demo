import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { RecycleModule } from '../recycle/recycle.module';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { Setting } from './setting.entity';

@Module({
  imports: [CacheModule.register(), TypeOrmModule.forFeature([Setting]), RecycleModule],
  providers: [SettingService],
  controllers: [SettingController],
  exports: [SettingService],
})
export class SettingModule {}
