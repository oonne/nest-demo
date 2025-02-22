import { IsString, IsOptional, IsIn, IsInt, IsBoolean } from 'class-validator';

/* 查询博客列表 */
export class GetListDto {
  @IsInt()
  pageNo: number;

  @IsInt()
  pageSize: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  publishDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  linkUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  keywords?: string;

  @IsOptional()
  @IsString()
  sortField?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;
}

/* 查询单个博客 */
export class GetDetailDto {
  @IsString()
  blogId: string;
}

/* 新建博客 */
export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  publishDate: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  linkUrl: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  keywords?: string;
}

/* 更新博客 */
export class UpdateBlogDto {
  @IsString()
  blogId: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  publishDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  linkUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  keywords?: string;
}

/* 删除博客 */
export class DeleteBlogDto {
  @IsString()
  blogId: string;
}
