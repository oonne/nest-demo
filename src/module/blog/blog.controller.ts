import { Controller, Post, Body, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Roles } from '../../common/decorator/roles.decorator';
import ErrorCode from '../../constant/error-code';
import { resSuccess } from '../../utils/index';
import type { HttpResponse, ListResponse } from '../../types/type';
import { RecycleService } from '../recycle/recycle.service';
import { BlogService } from './blog.service';
import {
  GetListDto,
  GetDetailDto,
  CreateBlogDto,
  UpdateBlogDto,
  DeleteBlogDto,
} from './dto/blog.dto';
import type { Blog } from './blog.entity';

@Controller('blog')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly RecycleService: RecycleService,
    private configService: ConfigService,
  ) {}

  /*
   * 查询博客列表
   */
  @Post('get-list')
  @Roles([1])
  async getList(@Body() getListDto: GetListDto): Promise<HttpResponse<ListResponse<Blog>>> {
    const { items, total } = await this.blogService.getList({
      pageNo: getListDto.pageNo,
      pageSize: getListDto.pageSize,
      sortField: getListDto.sortField,
      sortOrder: getListDto.sortOrder,
      title: getListDto.title,
      content: getListDto.content,
      publishDate: getListDto.publishDate,
      isActive: getListDto.isActive,
      linkUrl: getListDto.linkUrl,
      description: getListDto.description,
      keywords: getListDto.keywords,
    });

    // 返回字段处理
    items.forEach((item) => {
      delete item.id;
      if (item.content.length > 100) {
        item.content = `${item.content.slice(0, 100)}...`;
      }
    });

    return resSuccess({
      pageNo: getListDto.pageNo,
      total: total,
      list: items,
    });
  }

  /*
   * 查询博客详情
   */
  @Post('get-detail')
  @Roles([1])
  async getDetail(@Body() getDetailDto: GetDetailDto): Promise<HttpResponse<any>> {
    const blog = await this.blogService.getDetail(getDetailDto.blogId);
    if (!blog) {
      return {
        code: ErrorCode.BLOG_NOT_FOUND,
        message: '博客不存在',
      };
    }

    // 返回字段处理
    delete blog.id;

    return resSuccess(blog);
  }

  /*
   * 新增博客
   */
  @Post('add')
  @Roles([1])
  async add(@Body() createBlogDto: CreateBlogDto): Promise<HttpResponse<any>> {
    // 数据格式转换
    const newBlog = {
      ...createBlogDto,
      publishDate: new Date(createBlogDto.publishDate),
    };

    const res = await this.blogService.create(newBlog);
    return resSuccess(res);
  }

  /*
   * 更新博客
   */
  @Post('update')
  @Roles([1])
  async update(@Body() updateBlogDto: UpdateBlogDto): Promise<HttpResponse<any>> {
    const blog = await this.blogService.getDetail(updateBlogDto.blogId);
    if (!blog) {
      return {
        code: ErrorCode.BLOG_NOT_FOUND,
        message: '博客不存在',
      };
    }

    // 数据格式转换
    const newBlog: any = {
      ...updateBlogDto,
    };
    if (updateBlogDto.publishDate) {
      newBlog.publishDate = new Date(updateBlogDto.publishDate);
    }

    const res = await this.blogService.update(newBlog);
    return resSuccess(res);
  }

  /*
   * 删除博客
   */
  @Post('delete')
  @Roles([1])
  async delete(
    @Body() deleteBlogDto: DeleteBlogDto,
    @Req() req: Request,
  ): Promise<HttpResponse<any>> {
    const blog = await this.blogService.getDetail(deleteBlogDto.blogId);
    if (!blog) {
      return {
        code: ErrorCode.BLOG_NOT_FOUND,
        message: '博客不存在',
      };
    }

    // 加入到回收站
    const content = `
      博客ID: ${blog.blogId}
      标题: ${blog.title}
      日期: ${blog.publishDate}
      链接: ${blog.linkUrl}
      Description: ${blog.description}
      Keywords: ${blog.keywords}
      内容: ${blog.content}
    `;
    const recycle = await this.RecycleService.create({
      type: 3,
      content,
      deleteStaffId: req['staff']?.staffId,
    });
    if (!recycle) {
      return {
        code: ErrorCode.RECYCLE_FAILED,
        message: '回收失败',
      };
    }

    await this.blogService.delete(deleteBlogDto.blogId);
    return resSuccess(null);
  }

  /*
   * 生成博客静态网页
   * (异步生成，不会返回结果)
   */
  @Post('generate-blog')
  @Roles([1])
  async generateBlog(): Promise<HttpResponse<any>> {
    this.blogService.generateBlog();
    return resSuccess(null);
  }
}
