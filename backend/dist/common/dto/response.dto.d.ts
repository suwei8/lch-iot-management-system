export declare class ApiResponseDto<T = any> {
    code: number;
    message: string;
    data?: T;
    timestamp: number;
    constructor(code: number, message: string, data?: T);
    static success<T>(data?: T, message?: string): ApiResponseDto<T>;
    static error(code: number, message: string): ApiResponseDto;
}
export declare class PaginatedResponseDto<T = any> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    constructor(items: T[], total: number, page: number, limit: number);
}
export declare class StatsResponseDto {
    label: string;
    value: number;
    changePercent?: number;
    trend?: 'up' | 'down' | 'stable';
    extra?: any;
}
export declare class ChartDataResponseDto {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string;
        borderColor?: string;
    }[];
}
export declare class FileUploadResponseDto {
    filename: string;
    path: string;
    size: number;
    mimetype: string;
    uploadedAt: Date;
}
export declare class BatchOperationResponseDto {
    successCount: number;
    failureCount: number;
    totalCount: number;
    failures?: {
        id: any;
        error: string;
    }[];
    success: boolean;
    constructor(successCount: number, failureCount: number, failures?: {
        id: any;
        error: string;
    }[]);
}
