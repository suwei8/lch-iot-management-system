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

/**
 * 库存实体
 */
@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 物料名称
   */
  @Column({ length: 100 })
  itemName: string;

  /**
   * 物料类型：water-水，detergent-洗涤剂，wax-车蜡，foam-泡沫，other-其他
   */
  @Column({
    type: 'enum',
    enum: ['water', 'detergent', 'wax', 'foam', 'other'],
    default: 'other',
  })
  itemType: string;

  /**
   * 当前库存量
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentStock: number;

  /**
   * 最小库存阈值
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 10 })
  minThreshold: number;

  /**
   * 最大库存容量
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 100 })
  maxCapacity: number;

  /**
   * 单位：L-升，KG-千克，PCS-件
   */
  @Column({ length: 10, default: 'L' })
  unit: string;

  /**
   * 单价（分/单位）
   */
  @Column({ type: 'int', default: 0 })
  unitPrice: number;

  /**
   * 供应商
   */
  @Column({ length: 100, nullable: true })
  supplier: string;

  /**
   * 库存状态：normal-正常，low-库存不足，empty-缺货
   */
  @Column({
    type: 'enum',
    enum: ['normal', 'low', 'empty'],
    default: 'normal',
  })
  status: string;

  /**
   * 最后补货时间
   */
  @Column({ type: 'datetime', nullable: true })
  lastRestockAt: Date;

  /**
   * 备注
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
   * 门店ID
   */
  @Column()
  @Index('idx_inventory_store')
  storeId: number;

  /**
   * 门店关联
   */
  @ManyToOne(() => Store, (store) => store.inventory)
  @JoinColumn({ name: 'storeId' })
  store: Store;
}