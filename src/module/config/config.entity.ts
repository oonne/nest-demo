import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 'configId', nullable: false, unique: true })
  configId: string;

  @Column({ comment: 'key', length: 255, nullable: false, unique: true })
  key: string;

  @Column({ comment: 'value', type: 'mediumtext', nullable: true })
  value: string;

  @Column({ comment: '备注', type: 'text', nullable: true })
  remark: string;

  @CreateDateColumn({ comment: '创建时间', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间', nullable: false })
  updatedAt: Date;
}
