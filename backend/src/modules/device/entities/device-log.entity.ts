import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Device } from './device.entity';

/**
 * 设备日志实体
 */
@Entity('device_logs')
@Index('idx_device_log_devid_ts', ['devid', 'timestamp'])
export class DeviceLog {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 设备ID
   */
  @Column({ length: 50 })
  @Index('idx_device_log_devid')
  devid: string;

  /**
   * 事件类型：online-上线，offline-下线，cmd:09-启动回执，cmd:10-结算，cmd:13-配置，cmd:19-缺水缺液
   */
  @Column({ length: 20 })
  eventType: string;

  /**
   * 原始payload JSON数据
   */
  @Column({ type: 'json' })
  payload: any;

  /**
   * 解析后的关键字段
   */
  @Column({ type: 'json', nullable: true })
  parsedData: any;

  /**
   * 订单号（如果相关）
   */
  @Column({ length: 32, nullable: true })
  @Index('idx_device_log_order_no')
  orderNo: string;

  /**
   * 处理状态：pending-待处理，processed-已处理，failed-处理失败
   */
  @Column({
    type: 'enum',
    enum: ['pending', 'processed', 'failed'],
    default: 'pending',
  })
  processStatus: string;

  /**
   * 错误信息（如果处理失败）
   */
  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  /**
   * 事件时间戳
   */
  @Column({ type: 'datetime' })
  @Index('idx_device_log_timestamp')
  timestamp: Date;

  /**
   * 创建时间
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * 设备ID（外键）
   */
  @Column({ nullable: true })
  deviceId: number;

  /**
   * 设备关联
   */
  @ManyToOne(() => Device, (device) => device.logs)
  @JoinColumn({ name: 'deviceId' })
  device: Device;
}