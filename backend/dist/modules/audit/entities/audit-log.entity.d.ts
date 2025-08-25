import { User } from '../../user/entities/user.entity';
export declare class AuditLog {
    id: number;
    action: string;
    resourceType: string;
    resourceId: number;
    description: string;
    oldData: any;
    newData: any;
    ipAddress: string;
    userAgent: string;
    requestPath: string;
    requestMethod: string;
    requestData: any;
    responseData: any;
    result: string;
    errorMessage: string;
    duration: number;
    createdAt: Date;
    userId: number;
    user: User;
}
