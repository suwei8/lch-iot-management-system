import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MerchantService } from './merchant.service';
import { Merchant } from './entities/merchant.entity';
import { User } from '../user/entities/user.entity';
import { Device } from '../device/entities/device.entity';
import { Order } from '../order/entities/order.entity';
import { Store } from '../store/entities/store.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { Alert } from '../alert/entities/alert.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { DeviceLog } from '../device/entities/device-log.entity';
import { RedisService } from '../../config/redis.config';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// Mock bcryptjs
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('MerchantService', () => {
  let service: MerchantService;
  let repository: Repository<Merchant>;

  const mockMerchant: Merchant = {
    id: 1,
    name: '测试商户',
    code: 'MERCHANT001',
    contact: '张三',
    phone: '13800138000',
    address: '测试地址',
    longitude: 116.4074,
    latitude: 39.9042,
    status: 'active',
    shareRatio: 70.00,
    description: '测试商户描述',
    businessHours: '09:00-21:00',
    createdAt: new Date(),
    updatedAt: new Date(),
    devices: [],
    stores: [],
    orders: [],
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(),
    manager: {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MerchantService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Device),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Merchant),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Store),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Inventory),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(Alert),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(DeviceLog),
          useValue: mockRepository,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<MerchantService>(MerchantService);
    repository = module.get<Repository<Merchant>>(getRepositoryToken(Merchant));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMerchantProfile', () => {
    it('should return merchant profile successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockMerchant);

      const result = await service.getMerchantProfile(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockMerchant);
    });

    it('should throw NotFoundException if merchant not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getMerchantProfile(999)).rejects.toThrow(
        NotFoundException
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });
});