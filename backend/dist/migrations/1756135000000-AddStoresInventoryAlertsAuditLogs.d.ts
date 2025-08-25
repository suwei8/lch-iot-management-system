import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddStoresInventoryAlertsAuditLogs1756135000000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
