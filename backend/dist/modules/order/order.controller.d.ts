import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PayOrderDto } from './dto/pay-order.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(req: any, createOrderDto: CreateOrderDto): Promise<import("./entities/order.entity").Order>;
    findAll(req: any, page?: string, limit?: string, status?: string): Promise<{
        orders: import("./entities/order.entity").Order[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findAllForAdmin(page?: string, limit?: string, userId?: string, merchantId?: string, status?: string): Promise<{
        orders: import("./entities/order.entity").Order[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(req: any, id: number): Promise<import("./entities/order.entity").Order>;
    update(id: number, updateOrderDto: UpdateOrderDto): Promise<import("./entities/order.entity").Order>;
    pay(req: any, orderNumber: string, payOrderDto: PayOrderDto): Promise<import("./entities/order.entity").Order>;
    cancel(req: any, id: number): Promise<import("./entities/order.entity").Order>;
    startWash(orderNumber: string): Promise<import("./entities/order.entity").Order>;
    completeWash(orderNumber: string, body: {
        actualDuration?: number;
    }): Promise<import("./entities/order.entity").Order>;
    getUserStats(req: any): Promise<{
        totalOrders: number;
        completedOrders: number;
        totalAmount: number;
    }>;
    getUserStatsForAdmin(userId: number): Promise<{
        totalOrders: number;
        completedOrders: number;
        totalAmount: number;
    }>;
}
