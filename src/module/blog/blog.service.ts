import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import {
  existsSync,
  mkdirSync,
  copySync,
  writeFileSync,
  readFileSync,
  emptyDirSync,
  rmSync,
} from 'fs-extra';
import { Repository } from 'typeorm';
import { minify } from 'html-minifier-terser';
import { SettingService } from '../setting/setting.service';
import { Utils, Condition } from '../../utils/index';
import { Blog } from './blog.entity';

const { generateId } = Utils;
const { getStringCondition, getDateRangeCondition } = Condition;

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    private settingService: SettingService,
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

    // 压缩配置
    const minifyOptions = {
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
    };

    // 查询博客列表
    const blogs = await this.blogRepository.find({
      order: {
        publishDate: 'desc',
      },
    });
    if (!blogs.length) {
      logger.log('没有博客，不生成静态网页');
      return;
    }

    // 查询系统配置中的博客Description和Keywords
    const blogDescription = await this.settingService.getDetailByKey('BLOG_DESCRIPTION');
    const blogKeywords = await this.settingService.getDetailByKey('BLOG_KEYWORDS');

    // 创建新的博客目录
    const newBlogDir = join(process.cwd(), 'new-blog');
    mkdirSync(newBlogDir, { recursive: true });
    mkdirSync(join(newBlogDir, 'detail'), { recursive: true });
    mkdirSync(join(newBlogDir, 'assets'), { recursive: true });

    // 复制静态资源
    const templateDir = join(process.cwd(), 'src', 'module', 'blog', 'html-template');
    copySync(join(templateDir, 'favicon'), join(newBlogDir));
    copySync(join(templateDir, 'assets'), join(newBlogDir, 'assets'));

    // 压缩style.css
    const stylePath = join(newBlogDir, 'assets', 'styles.css');
    const styleContent = readFileSync(stylePath, 'utf-8');
    const minifiedStyle = await minify(styleContent, minifyOptions);
    writeFileSync(stylePath, minifiedStyle, 'utf-8');

    // 读取HTML模板
    const htmlTemplate = join(templateDir, 'index.html');
    const htmlContent = readFileSync(htmlTemplate, 'utf-8');

    // 循环每一篇博客，替换内容生成HTML
    for (const blog of blogs) {
      let detailHtml = htmlContent;
      detailHtml = detailHtml.replaceAll('%assetsPath%', '../assets');
      detailHtml = detailHtml.replace('%Description%', blog.description);
      detailHtml = detailHtml.replace('%Keyword%', blog.keywords);
      detailHtml = detailHtml.replace('%Title%', `${blog.title} - 工程师加一`);
      detailHtml = detailHtml.replace('%Content%', blog.content);
      detailHtml = await minify(detailHtml, minifyOptions);
      const detailFilePath = join(newBlogDir, 'detail', `${blog.linkUrl}.html`);
      writeFileSync(detailFilePath, detailHtml, 'utf-8');
    }

    // 生成列表页
    let blogList = '';
    for (const blog of blogs) {
      blogList += `<li class="blog-list-item"><a href="./detail/${blog.linkUrl}">
        <h2 class="blog-list-title">${blog.title}</h2>
        <p class="blog-list-description">${blog.description}</p>
      </a></li>`;
    }
    blogList = `<ul class="blog-list">${blogList}</ul>`;
    let indexHtml = htmlContent;
    indexHtml = indexHtml.replaceAll('%assetsPath%', './assets');
    indexHtml = indexHtml.replace('%Description%', blogDescription?.value || '');
    indexHtml = indexHtml.replace('%Keyword%', blogKeywords?.value || '');
    indexHtml = indexHtml.replace('%Title%', '工程师加一');
    indexHtml = indexHtml.replace('%Content%', blogList);
    indexHtml = await minify(indexHtml, minifyOptions);
    const indexFilePath = join(newBlogDir, 'index.html');
    writeFileSync(indexFilePath, indexHtml, 'utf-8');

    // 清空旧的博客目录
    const blogDir = join(process.cwd(), 'blog');
    if (existsSync(blogDir)) {
      emptyDirSync(blogDir, { recursive: true });
    } else {
      mkdirSync(blogDir, { recursive: true });
    }

    // 把new-blog目录下的内容复制到blog目录
    copySync(newBlogDir, blogDir);

    // 删除new-blog目录
    rmSync(newBlogDir, { recursive: true });
    logger.log('已重新生成博客');
  }
}
