import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffModule } from '../staff/staff.module';
import { RecycleService } from './recycle.service';
import { RecycleController } from './recycle.controller';
import { Recycle } from './recycle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recycle]), forwardRef(() => StaffModule)],
  providers: [RecycleService],
  controllers: [RecycleController],
  exports: [RecycleService],
})
export class RecycleModule {}
