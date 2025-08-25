import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Merchant } from '../../merchant/entities/merchant.entity';
import { Device } from '../../device/entities/device.entity';
import { Order } from '../../order/entities/order.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { User } from '../../user/entities/user.entity';
import { Alert } from '../../alert/entities/alert.entity';

/**
 * 门店实体
 */
@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 门店名称
   */
  @Column({ length: 100 })
  name: string;

  /**
   * 门店编码（唯一）
   */
  @Column({ length: 50, unique: true })
  @Index('idx_store_code')
  code: string;

  /**
   * 门店地址
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
   * 门店状态：active-正常营业，closed-暂停营业，maintenance-维护中
   */
  @Column({
    type: 'enum',
    enum: ['active', 'closed', 'maintenance'],
    default: 'active',
  })
  status: string;

  /**
   * 营业时间
   */
  @Column({ length: 100, nullable: true })
  businessHours: string;

  /**
   * 门店描述
   */
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * 基础洗车价格（分）
   */
  @Column({ type: 'int', default: 1000 })
  basicPrice: number;

  /**
   * 精洗价格（分）
   */
  @Column({ type: 'int', default: 1500 })
  premiumPrice: number;

  /**
   * 豪华洗车价格（分）
   */
  @Column({ type: 'int', default: 2000 })
  deluxePrice: number;

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
   * 商户ID
   */
  @Column()
  merchantId: number;

  /**
   * 商户关联
   */
  @ManyToOne(() => Merchant, (merchant) => merchant.stores)
  @JoinColumn({ name: 'merchantId' })
  merchant: Merchant;

  /**
   * 门店设备关联
   */
  @OneToMany(() => Device, (device) => device.store)
  devices: Device[];

  /**
   * 门店订单关联
   */
  @OneToMany(() => Order, (order) => order.store)
  orders: Order[];

  /**
   * 库存关联
   */
  @OneToMany(() => Inventory, (inventory) => inventory.store)
  inventory: Inventory[];

  /**
   * 员工关联
   */
  @OneToMany(() => User, (user) => user.store)
  staff: User[];

  /**
   * 告警关联
   */
  @OneToMany(() => Alert, (alert) => alert.store)
  alerts: Alert[];
}