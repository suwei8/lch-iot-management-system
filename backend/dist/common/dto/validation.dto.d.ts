export declare class IdDto {
    id: number;
}
export declare class BatchIdDto {
    ids: number[];
}
export declare class StatusUpdateDto {
    status: string;
    remark?: string;
}
export declare class SortDto {
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
export declare class DateRangeDto {
    startDate: string;
    endDate: string;
}
export declare class SearchDto {
    keyword?: string;
    fields?: string[];
}
export declare class PasswordDto {
    password: string;
}
export declare class ChangePasswordDto extends PasswordDto {
    oldPassword: string;
    confirmPassword: string;
}
export declare class PhoneDto {
    phone: string;
}
export declare class EmailDto {
    email: string;
}
export declare class VerificationCodeDto {
    code: string;
    type: string;
}
export declare class FileUploadDto {
    fileType?: string;
    maxSize?: number;
}
export declare class CoordinateDto {
    longitude: number;
    latitude: number;
}
export declare class AddressDto extends CoordinateDto {
    province: string;
    city: string;
    district: string;
    address: string;
    zipCode?: string;
}
