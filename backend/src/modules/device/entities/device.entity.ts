import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Merchant } from '../../merchant/entities/merchant.entity';
import { Order } from '../../order/entities/order.entity';
import { DeviceLog } from './device-log.entity';
import { Store } from '../../store/entities/store.entity';

/**
 * 设备实体
 */
@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 设备ID（唯一）
   */
  @Column({ length: 50, unique: true })
  @Index('idx_device_devid')
  devid: string;

  /**
   * 设备名称
   */
  @Column({ length: 100 })
  name: string;

  /**
   * 设备型号
   */
  @Column({ length: 50, nullable: true })
  model: string;

  /**
   * 设备状态：online-在线，offline-离线，busy-使用中，maintenance-维护中
   */
  @Column({
    type: 'enum',
    enum: ['online', 'offline', 'busy', 'maintenance'],
    default: 'offline',
  })
  status: string;

  /**
   * ICCID（SIM卡号）
   */
  @Column({ length: 20, nullable: true })
  iccid: string;

  /**
   * 设备配置JSON
   */
  @Column({ type: 'json', nullable: true })
  config: any;

  /**
   * 设备位置描述
   */
  @Column({ length: 255, nullable: true })
  location: string;

  /**
   * 经度
   */
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  /**
   * 纬度
   */
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  /**
   * 最后在线时间
   */
  @Column({ type: 'datetime', nullable: true })
  lastOnlineAt: Date;

  /**
   * 最后离线时间
   */
  @Column({ type: 'datetime', nullable: true })
  lastOfflineAt: Date;

  /**
   * 设备版本
   */
  @Column({ length: 20, nullable: true })
  version: string;

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
   * 所属商户ID
   */
  @Column()
  merchantId: number;

  /**
   * 所属门店ID
   */
  @Column({ nullable: true })
  storeId: number;

  /**
   * 所属商户关联
   */
  @ManyToOne(() => Merchant, (merchant) => merchant.devices)
  @JoinColumn({ name: 'merchantId' })
  merchant: Merchant;

  /**
   * 所属门店关联
   */
  @ManyToOne(() => Store, (store) => store.devices, { nullable: true })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  /**
   * 设备订单关联
   */
  @OneToMany(() => Order, (order) => order.device)
  orders: Order[];

  /**
   * 设备日志关联
   */
  @OneToMany(() => DeviceLog, (log) => log.device)
  logs: DeviceLog[];
}