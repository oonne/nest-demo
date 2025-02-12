import { IsString, IsOptional, IsIn, IsInt } from 'class-validator';

/* 查询文件列表 */
export class GetListDto {
  @IsInt()
  pageNo: number;

  @IsInt()
  pageSize: number;

  @IsOptional()
  @IsInt()
  type?: number;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  fileSize?: string;

  @IsOptional()
  @IsString()
  sortField?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;
}

/* 查询单个文件 */
export class GetDetailDto {
  @IsString()
  fileId: string;
}

/* 删除文件 */
export class DeleteFileDto {
  @IsString()
  fileId: string;
}
