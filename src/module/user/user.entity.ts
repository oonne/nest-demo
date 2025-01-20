import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户名', length: 255, nullable: false })
  name: string;

  @Column({ comment: '密码(hashed)', length: 255, nullable: false })
  password: string;

  @Column({ comment: '是否启用', default: true, nullable: false })
  isActive: boolean;

  @CreateDateColumn({ comment: '创建时间', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间', nullable: false })
  updatedAt: Date;
}
