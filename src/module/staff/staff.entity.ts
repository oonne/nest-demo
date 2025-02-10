import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { roleDesc } from '../../constant/role';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'staffId', nullable: false, unique: true })
  staffId: string;

  @Column({ comment: '用户名', length: 255, nullable: false, unique: true })
  name: string;

  @Column({ comment: '密码(hashed)', length: 255, nullable: false })
  password: string;

  @Column({ comment: `角色: ${roleDesc}`, type: 'int', nullable: false })
  role: number;

  @Column({ comment: '是否启用', default: true, nullable: false })
  isActive: boolean;

  @Column({ comment: 'Refresh Token', length: 255, nullable: true })
  refreshToken: string;

  @Column({ comment: '登录接口的pow的盐', length: 255, nullable: true })
  loginPowSalt: string;

  @Column({ comment: '登录接口的pow的结果', length: 255, nullable: true })
  loginPowResult: string;

  @CreateDateColumn({ comment: '创建时间', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间', nullable: false })
  updatedAt: Date;
}
