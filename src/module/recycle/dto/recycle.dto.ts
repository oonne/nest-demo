import { IsInt, IsArray, IsString, IsOptional, IsIn } from 'class-validator';
import { recycleTypeKeyArr } from '../../../constant/recycle-type';

/* 查询回收站列表 */
export class GetListDto {
  @IsInt()
  pageNo: number;

  @IsInt()
  pageSize: number;

  @IsOptional()
  @IsArray()
  @IsIn(recycleTypeKeyArr, { each: true })
  type?: number[];

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  deleteStaffName?: string;

  @IsOptional()
  @IsString()
  sortField?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;
}

/* 查询单个回收项 */
export class GetDetailDto {
  @IsString()
  recycleId: string;
}

/* 删除回收项 */
export class DeleteRecycleDto {
  @IsString()
  recycleId: string;
}
