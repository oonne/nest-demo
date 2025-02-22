import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'blogId', nullable: false, unique: true })
  blogId: string;

  @Column({ comment: '标题', nullable: false })
  title: string;

  @Column({ comment: '内容', type: 'mediumtext', nullable: false })
  content: string;

  @Column({ comment: '发布日期', nullable: false })
  publishDate: Date;

  @Column({ comment: '是否启用', default: false, nullable: false })
  isActive: boolean;

  @Column({ comment: '链接', length: 255, nullable: false })
  linkUrl: string;

  @Column({ comment: 'Description', nullable: true })
  description: string;

  @Column({ comment: 'Keywords', nullable: true })
  keywords: string;

  @CreateDateColumn({ comment: '创建时间', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间', nullable: false })
  updatedAt: Date;
}
