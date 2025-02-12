import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecycleModule } from '../recycle/recycle.module';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { File } from './file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File]), RecycleModule],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
