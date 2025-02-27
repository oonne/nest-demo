import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { existsSync, mkdirSync, rmdirSync, renameSync, copySync } from 'fs-extra';
import { Repository } from 'typeorm';
import { Utils, Condition } from '../../utils/index';
import { Blog } from './blog.entity';

const { generateId } = Utils;
const { getStringCondition, getDateRangeCondition } = Condition;

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  /*
   * 查询列表
   */
  async getList({
    pageNo = 1,
    pageSize = 10,
    sortField = 'createdAt',
    sortOrder = 'desc',
    title,
    content,
    publishDate,
    isActive,
    linkUrl,
    description,
    keywords,
  }: {
    pageNo?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    title?: string;
    content?: string;
    publishDate?: string;
    isActive?: boolean;
    linkUrl?: string;
    description?: string;
    keywords?: string;
  }): Promise<{ items: Blog[]; total: number }> {
    const [items, total] = await this.blogRepository.findAndCount({
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
      order: {
        [sortField]: sortOrder,
      },
      where: {
        title: getStringCondition(title),
        content: getStringCondition(content),
        publishDate: getDateRangeCondition(publishDate),
        isActive: isActive,
        linkUrl: getStringCondition(linkUrl),
        description: getStringCondition(description),
        keywords: getStringCondition(keywords),
      },
    });

    return {
      items,
      total,
    };
  }

  /*
   * 查询详情
   */
  getDetail(blogId: string): Promise<Blog> {
    return this.blogRepository.findOneBy({ blogId });
  }

  /*
   * 新增
   */
  async create(blog: Partial<Blog>): Promise<Blog> {
    // 生成随机的blogId
    const blogId = generateId('blog');
    // 如果blogId已存在，则重新生成
    if (await this.blogRepository.findOneBy({ blogId })) {
      return this.create(blog);
    }

    const blogToCreate = {
      ...blog,
      blogId,
    };

    return this.blogRepository.save(blogToCreate);
  }

  /*
   * 更新
   */
  async update(blog: Partial<Blog>): Promise<Blog> {
    let blogToUpdate = await this.blogRepository.findOneBy({ blogId: blog.blogId });
    if (!blogToUpdate) {
      throw new Error('Blog not found');
    }

    blogToUpdate = {
      ...blogToUpdate,
      ...blog,
    };

    return this.blogRepository.save(blogToUpdate);
  }

  /*
   * 删除
   */
  async delete(blogId: string): Promise<void> {
    await this.blogRepository.delete({ blogId });
  }

  /*
   * 生成静态网页
   */
  // 生成完整的博客
  async generateBlog(): Promise<void> {
    const logger = new Logger();
    // 查询博客列表
    const blogs = await this.blogRepository.find();
    if (!blogs.length) {
      return;
    }

    // 创建新的博客目录
    const newBlogDir = join(process.cwd(), 'new-blog');
    mkdirSync(newBlogDir, { recursive: true });

    // 复制静态资源
    const templateDir = join(process.cwd(), 'src', 'module', 'blog', 'html-template');
    copySync(join(templateDir, 'favicon'), join(newBlogDir));
    copySync(join(templateDir, 'assets'), join(newBlogDir));

    // 循环每一篇博客
    for (const blog of blogs) {
      console.log(blog);
    }

    // 删除旧的博客目录
    const blogDir = join(process.cwd(), 'blog');
    if (existsSync(blogDir)) {
      rmdirSync(blogDir, { recursive: true });
    }

    // 将新的博客目录重命名为博客目录
    renameSync(newBlogDir, blogDir);
    logger.log('已重新生成博客');
  }
}
