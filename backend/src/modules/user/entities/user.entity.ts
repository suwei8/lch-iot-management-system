import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { Store } from '../../store/entities/store.entity';
import { AuditLog } from '../../audit/entities/audit-log.entity';
import { UserRole } from '../../../common/decorators/roles.decorator';

/**
 * 用户实体
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 手机号（唯一）
   */
  @Column({ length: 11, unique: true })
  @Index('idx_user_phone')
  phone: string;

  /**
   * 密码（加密后）
   */
  @Column({ length: 255 })
  password: string;

  /**
   * 用户角色
   */
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  /**
   * 用户昵称
   */
  @Column({ length: 50, nullable: true })
  nickname: string;

  /**
   * 头像URL
   */
  @Column({ length: 255, nullable: true })
  avatar: string;

  /**
   * 账户余额（分）
   */
  @Column({ type: 'int', default: 0 })
  balance: number;

  /**
   * 账户状态：active-正常，disabled-禁用
   */
  @Column({
    type: 'enum',
    enum: ['active', 'disabled'],
    default: 'active',
  })
  status: string;

  /**
   * 门店ID（仅门店员工需要）
   */
  @Column({ nullable: true })
  storeId: number;

  /**
   * 员工角色（仅门店员工需要）
   */
  @Column({ length: 20, nullable: true })
  staffRole: string;

  /**
   * 最后登录时间
   */
  @Column({ type: 'datetime', nullable: true })
  lastLoginAt: Date;

  /**
   * 创建时间
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * 更新时间
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * 用户订单关联
   */
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  /**
   * 门店关联（仅门店员工）
   */
  @ManyToOne(() => Store, (store) => store.staff, { nullable: true })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  /**
   * 审计日志关联
   */
  @OneToMany(() => AuditLog, (auditLog) => auditLog.user)
  auditLogs: AuditLog[];
}