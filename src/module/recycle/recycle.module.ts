import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffModule } from '../staff/staff.module';
import { RecycleService } from './recycle.service';
import { RecycleController } from './recycle.controller';
import { Recycle } from './recycle.entity';

@Module({
  imports: [StaffModule, TypeOrmModule.forFeature([Recycle])],
  providers: [RecycleService],
  controllers: [RecycleController],
  exports: [RecycleService],
})
export class RecycleModule {}
