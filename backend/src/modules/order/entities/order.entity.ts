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
import { User } from '../../user/entities/user.entity';
import { Merchant } from '../../merchant/entities/merchant.entity';
import { Device } from '../../device/entities/device.entity';
import { Store } from '../../store/entities/store.entity';

/**
 * 订单实体
 */
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 订单号（唯一，用于幂等）
   */
  @Column({ length: 32, unique: true })
  @Index('idx_order_no')
  orderNo: string;

  /**
   * 订单金额（分）
   */
  @Column({ type: 'int' })
  amount: number;

  /**
   * 订单状态：draft-草稿，pending-待支付，paid-已支付，using-使用中，completed-已完成，cancelled-已取消，refunded-已退款
   */
  @Column({
    type: 'enum',
    enum: ['draft', 'pending', 'paid', 'using', 'completed', 'cancelled', 'refunded'],
    default: 'draft',
  })
  status: string;

  /**
   * 洗车类型：basic-基础洗车，premium-精洗，deluxe-豪华洗车
   */
  @Column({
    type: 'enum',
    enum: ['basic', 'premium', 'deluxe'],
    default: 'basic',
  })
  washType: string;

  /**
   * 洗车时长（分钟）
   */
  @Column({ type: 'int', nullable: true })
  duration: number;

  /**
   * 开始时间
   */
  @Column({ type: 'datetime', nullable: true })
  startTime: Date;

  /**
   * 结束时间
   */
  @Column({ type: 'datetime', nullable: true })
  endTime: Date;

  /**
   * 支付时间
   */
  @Column({ type: 'datetime', nullable: true })
  paidAt: Date;

  /**
   * 支付方式：wechat-微信，alipay-支付宝，balance-余额
   */
  @Column({ length: 20, nullable: true })
  paymentMethod: string;

  /**
   * 第三方支付订单号
   */
  @Column({ length: 64, nullable: true })
  paymentOrderNo: string;

  /**
   * 第三方订单号
   */
  @Column({ length: 64, nullable: true })
  thirdPartyOrderNumber: string;

  /**
   * 订单备注
   */
  @Column({ type: 'text', nullable: true })
  remark: string;

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
   * 用户ID
   */
  @Column()
  userId: number;

  /**
   * 商户ID
   */
  @Column()
  merchantId: number;

  /**
   * 设备ID
   */
  @Column()
  deviceId: number;

  /**
   * 门店ID
   */
  @Column()
  storeId: number;

  /**
   * 用户关联
   */
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * 商户关联
   */
  @ManyToOne(() => Merchant, (merchant) => merchant.orders)
  @JoinColumn({ name: 'merchantId' })
  merchant: Merchant;

  /**
   * 设备关联
   */
  @ManyToOne(() => Device, (device) => device.orders)
  @JoinColumn({ name: 'deviceId' })
  device: Device;

  /**
   * 门店关联
   */
  @ManyToOne(() => Store, (store) => store.orders)
  @JoinColumn({ name: 'storeId' })
  store: Store;
}