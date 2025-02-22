import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
