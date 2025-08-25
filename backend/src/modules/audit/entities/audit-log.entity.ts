import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

/**
 * 审计日志实体
 */
@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 操作类型：CREATE-创建，UPDATE-更新，DELETE-删除，LOGIN-登录，LOGOUT-登出，EXPORT-导出，SYSTEM-系统操作
   */
  @Column({
    type: 'enum',
    enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'SYSTEM'],
  })
  @Index('idx_audit_action')
  action: string;

  /**
   * 操作的资源类型：user, merchant, store, device, order, inventory, alert等
   */
  @Column({ length: 50 })
  @Index('idx_audit_resource')
  resourceType: string;

  /**
   * 操作的资源ID
   */
  @Column({ nullable: true })
  resourceId: number;

  /**
   * 操作描述
   */
  @Column({ length: 500 })
  description: string;

  /**
   * 操作前的数据（JSON格式）
   */
  @Column({ type: 'json', nullable: true })
  oldData: any;

  /**
   * 操作后的数据（JSON格式）
   */
  @Column({ type: 'json', nullable: true })
  newData: any;

  /**
   * 客户端IP地址
   */
  @Column({ length: 45, nullable: true })
  ipAddress: string;

  /**
   * 用户代理信息
   */
  @Column({ length: 500, nullable: true })
  userAgent: string;

  /**
   * 请求路径
   */
  @Column({ length: 200, nullable: true })
  requestPath: string;

  /**
   * 请求方法
   */
  @Column({ length: 10, nullable: true })
  requestMethod: string;

  /**
   * 请求数据（JSON格式）
   */
  @Column({ type: 'json', nullable: true })
  requestData: any;

  /**
   * 响应数据（JSON格式）
   */
  @Column({ type: 'json', nullable: true })
  responseData: any;

  /**
   * 操作结果：SUCCESS-成功，FAILED-失败
   */
  @Column({
    type: 'enum',
    enum: ['SUCCESS', 'FAILED'],
    default: 'SUCCESS',
  })
  result: string;

  /**
   * 错误信息（操作失败时记录）
   */
  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  /**
   * 操作耗时（毫秒）
   */
  @Column({ type: 'int', nullable: true })
  duration: number;

  /**
   * 创建时间
   */
  @CreateDateColumn()
  @Index('idx_audit_created')
  createdAt: Date;

  /**
   * 操作用户ID
   */
  @Column()
  @Index('idx_audit_user')
  userId: number;

  /**
   * 操作用户关联
   */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}