import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceService } from './device.service';
import { Device } from './entities/device.entity';
import { DeviceLog } from './entities/device-log.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { RedisService } from '../../config/redis.config';

describe('DeviceService', () => {
  let service: DeviceService;
  let repository: Repository<Device>;

  const mockDevice: Device = {
    id: 1,
    devid: 'DEVICE001',
    name: '测试设备',
    model: 'DHT22-Pro',
    status: 'online',
    iccid: '89860318740800123456',
    config: { sampleRate: 60 },
    location: '测试位置',
    longitude: 116.4074,
    latitude: 39.9042,
    lastOnlineAt: new Date(),
    lastOfflineAt: null,
    version: 'v1.2.3',
    createdAt: new Date(),
    updatedAt: new Date(),
    merchantId: 1,
    storeId: null,
    merchant: null,
    store: null,
    orders: [],
    logs: [],
  };

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockDeviceLogRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockRedisService = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
  };

  beforeEach(async () => {
    // 重置所有mock
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceService,
        {
          provide: getRepositoryToken(Device),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(DeviceLog),
          useValue: mockDeviceLogRepository,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<DeviceService>(DeviceService);
    repository = module.get<Repository<Device>>(getRepositoryToken(Device));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDeviceDto: CreateDeviceDto = {
      name: '新设备',
      model: 'DHT22-Pro',
      iccid: '89860318740800123457',
      merchantId: 1,
      config: { sampleRate: 60 },
      location: '新位置',
      latitude: 39.9042,
      longitude: 116.4074,
      version: 'v2.0.0',
    };

    it('should create a new device successfully', async () => {
      // 模拟创建和保存设备
      const newDevice = { ...mockDevice, ...createDeviceDto, id: 2 };
      mockRepository.create.mockReturnValue(newDevice);
      mockRepository.save.mockResolvedValue(newDevice);

      const result = await service.create(createDeviceDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDeviceDto,
        status: 'offline',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(mockRepository.save).toHaveBeenCalledWith(newDevice);
      expect(result).toEqual(newDevice);
    });


  });

  describe('findAll', () => {
    it('should return all devices with relations', async () => {
      const devices = [mockDevice];
      const total = 1;
      mockQueryBuilder.getManyAndCount.mockResolvedValue([devices, total]);

      const result = await service.findAll();

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('device');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('device.merchant', 'merchant');
      expect(result).toEqual({
        devices,
        total,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should return empty array when no devices exist', async () => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      const result = await service.findAll();

      expect(result).toEqual({
        devices: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });
    });
  });

  describe('findOne', () => {
    it('should return a device by id with relations', async () => {
      mockRepository.findOne.mockResolvedValue(mockDevice);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['merchant'],
      });
      expect(result).toEqual(mockDevice);
    });

    it('should throw NotFoundException if device not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['merchant'],
      });
    });
  });

  describe('findByIccid', () => {
    it('should return a device by iccid', async () => {
      mockRepository.findOne.mockResolvedValue(mockDevice);

      const result = await service.findByIccid('1234567890');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { iccid: '1234567890' },
        relations: ['merchant'],
      });
      expect(result).toEqual(mockDevice);
    });

    it('should throw NotFoundException if device not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByIccid('NONEXISTENT')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { iccid: 'NONEXISTENT' },
        relations: ['merchant'],
      });
    });
  });

  // Note: findByMerchant method does not exist in DeviceService
  // Merchant filtering is handled in findAll method with merchantId parameter

  describe('update', () => {
    const updateDeviceDto: UpdateDeviceDto = {
      name: '更新的设备',
      location: '更新的位置',
      status: 'maintenance',
    };

    it('should update a device successfully', async () => {
      const updatedDevice = { ...mockDevice, ...updateDeviceDto };
      mockRepository.findOne.mockResolvedValue(mockDevice);
      mockRepository.findOne.mockResolvedValueOnce(mockDevice).mockResolvedValueOnce(updatedDevice);

      const result = await service.update(1, updateDeviceDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['merchant'],
      });
      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        ...updateDeviceDto,
        updatedAt: expect.any(Date),
      });
      expect(result).toEqual(updatedDevice);
    });

    it('should throw NotFoundException if device not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateDeviceDto)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['merchant'],
      });
    });
  });

  // Note: updateStatus method does not exist in DeviceService
  // Status updates are handled internally by handleCallback method



  describe('remove', () => {
    it('should remove a device successfully', async () => {
      // Mock findOne method which is called by remove
      jest.spyOn(service, 'findOne').mockResolvedValue(mockDevice);
      mockRepository.remove.mockResolvedValue(mockDevice);

      await service.remove(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(mockRepository.remove).toHaveBeenCalledWith(mockDevice);
    });

    it('should throw NotFoundException if device not found', async () => {
      // Mock findOne to throw NotFoundException
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('设备不存在'));

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });


});