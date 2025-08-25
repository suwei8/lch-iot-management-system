import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserService } from '../user/user.service';
import { DeviceService } from '../device/device.service';
import { RedisService } from '../../config/redis.config';
export declare class OrderService {
    private orderRepository;
    private userService;
    private deviceService;
    private redisService;
    constructor(orderRepository: Repository<Order>, userService: UserService, deviceService: DeviceService, redisService: RedisService);
    create(userId: number, createOrderDto: CreateOrderDto): Promise<Order>;
    findAll(page?: number, limit?: number, userId?: number, merchantId?: number, status?: string): Promise<{
        orders: Order[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<Order>;
    findByOrderNumber(orderNumber: string): Promise<Order>;
    update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order>;
    startWash(orderNumber: string): Promise<Order>;
    completeWash(orderNumber: string, actualDuration?: number): Promise<Order>;
    cancel(id: number, userId: number): Promise<Order>;
    pay(orderNumber: string, paymentMethod: string): Promise<Order>;
    private generateOrderNumber;
    getUserOrderStats(userId: number): Promise<{
        totalOrders: number;
        completedOrders: number;
        totalAmount: number;
    }>;
}
