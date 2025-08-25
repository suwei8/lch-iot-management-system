import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Device } from '../../device/entities/device.entity';
import { Order } from '../../order/entities/order.entity';
import { Store } from '../../store/entities/store.entity';

/**
 * 商户实体
 */
@Entity('merchants')
export class Merchant {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 商户名称
   */
  @Column({ length: 100 })
  name: string;

  /**
   * 商户编码（唯一）
   */
  @Column({ length: 50, unique: true })
  @Index('idx_merchant_code')
  code: string;

  /**
   * 联系人
   */
  @Column({ length: 50 })
  contact: string;

  /**
   * 联系电话
   */
  @Column({ length: 20 })
  phone: string;

  /**
   * 商户地址
   */
  @Column({ length: 255 })
  address: string;

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
   * 商户状态：active-正常，disabled-禁用
   */
  @Column({
    type: 'enum',
    enum: ['active', 'disabled'],
    default: 'active',
  })
  status: string;

  /**
   * 分成比例（百分比，如85表示85%）
   */
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 70.00 })
  shareRatio: number;

  /**
   * 商户描述
   */
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * 营业时间
   */
  @Column({ length: 100, nullable: true })
  businessHours: string;

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
   * 商户设备关联
   */
  @OneToMany(() => Device, (device) => device.merchant)
  devices: Device[];

  /**
   * 商户订单关联
   */
  @OneToMany(() => Order, (order) => order.merchant)
  orders: Order[];

  /**
   * 商户门店关联
   */
  @OneToMany(() => Store, (store) => store.merchant)
  stores: Store[];
}