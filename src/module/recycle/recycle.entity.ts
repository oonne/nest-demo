import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { recycleTypeDesc } from '../../constant/recycle-type';

@Entity()
export class Recycle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'recycleId', length: 255, nullable: false, unique: true })
  recycleId: string;

  @Column({ comment: `类型: ${recycleTypeDesc}`, type: 'int', nullable: false })
  type: number;

  @Column({ comment: '内容', type: 'mediumtext', nullable: false })
  content: string;

  @Column({ comment: '删除者', length: 255, nullable: false })
  deleteStaffId: string;

  @Column({ comment: '删除者名称', length: 255, nullable: false })
  deleteStaffName: string;

  @CreateDateColumn({ comment: '创建时间', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间', nullable: false })
  updatedAt: Date;
}
