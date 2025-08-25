import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from '../../store/entities/store.entity';
import { Device } from '../../device/entities/device.entity';
import { User } from '../../user/entities/user.entity';

/**
 * 告警实体
 */
@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 告警类型：device_offline-设备离线，low_inventory-库存不足，device_error-设备故障，payment_failed-支付失败，system_error-系统错误
   */
  @Column({
    type: 'enum',
    enum: ['device_offline', 'low_inventory', 'device_error', 'payment_failed', 'system_error'],
  })
  @Index('idx_alert_type')
  type: string;

  /**
   * 告警级别：low-低，medium-中，high-高，critical-紧急
   */
  @Column({
    type: 'enum',
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  })
  level: string;

  /**
   * 告警标题
   */
  @Column({ length: 200 })
  title: string;

  /**
   * 告警内容
   */
  @Column({ type: 'text' })
  content: string;

  /**
   * 告警状态：pending-待处理，acknowledged-已确认，resolved-已解决，ignored-已忽略
   */
  @Column({
    type: 'enum',
    enum: ['pending', 'acknowledged', 'resolved', 'ignored'],
    default: 'pending',
  })
  @Index('idx_alert_status')
  status: string;

  /**
   * 相关数据（JSON格式，存储告警相关的详细信息）
   */
  @Column({ type: 'json', nullable: true })
  metadata: any;

  /**
   * 确认时间
   */
  @Column({ type: 'datetime', nullable: true })
  acknowledgedAt: Date;

  /**
   * 确认人ID
   */
  @Column({ nullable: true })
  acknowledgedBy: number;

  /**
   * 处理方案
   */
  @Column({ type: 'text', nullable: true })
  resolution: string;

  /**
   * 解决时间
   */
  @Column({ type: 'datetime', nullable: true })
  resolvedAt: Date;

  /**
   * 处理备注
   */
  @Column({ type: 'text', nullable: true })
  remark: string;

  /**
   * 创建时间
   */
  @CreateDateColumn()
  @Index('idx_alert_created')
  createdAt: Date;

  /**
   * 更新时间
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * 门店ID（可选，某些告警可能不关联具体门店）
   */
  @Column({ nullable: true })
  @Index('idx_alert_store')
  storeId: number;

  /**
   * 设备ID（可选，设备相关告警）
   */
  @Column({ nullable: true })
  deviceId: number;

  /**
   * 处理人ID（可选）
   */
  @Column({ nullable: true })
  handlerId: number;

  /**
   * 门店关联
   */
  @ManyToOne(() => Store, { nullable: true })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  /**
   * 设备关联
   */
  @ManyToOne(() => Device, { nullable: true })
  @JoinColumn({ name: 'deviceId' })
  device: Device;

  /**
   * 处理人关联
   */
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'handlerId' })
  handler: User;
}