import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'fileId', nullable: false, unique: true })
  fileId: string;

  @Column({ comment: `类型: 1 图片, 2 文件`, type: 'int', nullable: false })
  type: number;

  @Column({ comment: '文件名', length: 255, nullable: false, unique: true })
  fileName: string;

  @Column({ comment: '文件大小', type: 'int', nullable: false })
  fileSize: number;

  @CreateDateColumn({ comment: '创建时间', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间', nullable: false })
  updatedAt: Date;
}
