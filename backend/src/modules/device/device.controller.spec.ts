import { Test, TestingModule } from '@nestjs/testing';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('DeviceController', () => {
  let controller: DeviceController;
  let service: DeviceService;

  const mockDevice = {
    id: 1,
    deviceId: 'DEVICE001',
    name: '测试设备',
    type: 'sensor',
    status: 'online',
    location: '测试位置',
    merchantId: 1,
    lastHeartbeat: new Date(),
    metadata: { version: '1.0.0' },
    createdAt: new Date(),
    updatedAt: new Date(),
    merchant: {
      id: 1,
      name: '测试商户',
      email: 'test@merchant.com',
    },
  };

  const mockDeviceService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByDeviceId: jest.fn(),
    findByMerchant: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    updateHeartbeat: jest.fn(),
    remove: jest.fn(),
    getDeviceStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceController],
      providers: [
        {
          provide: DeviceService,
          useValue: mockDeviceService,
        },
      ],
    }).compile();

    controller = module.get<DeviceController>(DeviceController);
    service = module.get<DeviceService>(DeviceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createDeviceDto: CreateDeviceDto = {
      name: '新设备',
      model: 'DHT22-Pro',
      iccid: '89860318740800123456',
      merchantId: 1,
      location: '新位置',
      config: { version: '2.0.0' },
    };

    it('should create a new device successfully', async () => {
      const newDevice = { ...mockDevice, ...createDeviceDto, id: 2 };
      mockDeviceService.create.mockResolvedValue(newDevice);

      const result = await controller.create(createDeviceDto);

      expect(mockDeviceService.create).toHaveBeenCalledWith(createDeviceDto);
      expect(result).toEqual(newDevice);
    });

    it('should handle ConflictException when device ID already exists', async () => {
      mockDeviceService.create.mockRejectedValue(
        new ConflictException('设备ID已存在')
      );

      await expect(controller.create(createDeviceDto)).rejects.toThrow(
        ConflictException
      );
      expect(mockDeviceService.create).toHaveBeenCalledWith(createDeviceDto);
    });
  });

  describe('findAll', () => {
    it('should return all devices', async () => {
      const devices = [mockDevice];
      mockDeviceService.findAll.mockResolvedValue(devices);

      const result = await controller.findAll();

      expect(mockDeviceService.findAll).toHaveBeenCalled();
      expect(result).toEqual(devices);
    });

    it('should return empty array when no devices exist', async () => {
      mockDeviceService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a device by id', async () => {
      mockDeviceService.findOne.mockResolvedValue(mockDevice);

      const result = await controller.findOne(1);

      expect(mockDeviceService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockDevice);
    });

    it('should handle NotFoundException when device not found', async () => {
      mockDeviceService.findOne.mockRejectedValue(
        new NotFoundException('设备未找到')
      );

      await expect(controller.findOne(999)).rejects.toThrow(
        NotFoundException
      );
      expect(mockDeviceService.findOne).toHaveBeenCalledWith(999);
    });
  });



  describe('update', () => {
    const updateDeviceDto: UpdateDeviceDto = {
      name: '更新的设备',
      location: '更新的位置',
      status: 'maintenance',
    };

    it('should update a device successfully', async () => {
      const updatedDevice = { ...mockDevice, ...updateDeviceDto };
      mockDeviceService.update.mockResolvedValue(updatedDevice);

      const result = await controller.update(1, updateDeviceDto);

      expect(mockDeviceService.update).toHaveBeenCalledWith(1, updateDeviceDto);
      expect(result).toEqual(updatedDevice);
    });

    it('should handle NotFoundException when device not found', async () => {
      mockDeviceService.update.mockRejectedValue(
        new NotFoundException('设备未找到')
      );

      await expect(controller.update(999, updateDeviceDto)).rejects.toThrow(
        NotFoundException
      );
      expect(mockDeviceService.update).toHaveBeenCalledWith(999, updateDeviceDto);
    });
  });

  // updateStatus method does not exist in DeviceController
  // Device status updates should be handled through the update method
  /*
  describe('updateStatus', () => {
    it('should update device status successfully', async () => {
      const updatedDevice = { ...mockDevice, status: 'offline' };
      mockDeviceService.updateStatus.mockResolvedValue(updatedDevice);

      const result = await controller.updateStatus('1', { status: 'offline' });

      expect(mockDeviceService.updateStatus).toHaveBeenCalledWith(1, 'offline');
      expect(result).toEqual(updatedDevice);
    });

    it('should handle NotFoundException when device not found', async () => {
      mockDeviceService.updateStatus.mockRejectedValue(
        new NotFoundException('设备未找到')
      );

      await expect(
        controller.updateStatus('999', { status: 'offline' })
      ).rejects.toThrow(NotFoundException);
    });
  */

  // Note: updateHeartbeat method does not exist in DeviceController
  // Heartbeat updates are handled internally by the handleCallback method

  describe('remove', () => {
    it('should remove a device successfully', async () => {
      mockDeviceService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(mockDeviceService.remove).toHaveBeenCalledWith(1);
    });

    it('should handle NotFoundException when device not found', async () => {
      mockDeviceService.remove.mockRejectedValue(
        new NotFoundException('设备未找到')
      );

      await expect(controller.remove(999)).rejects.toThrow(
        NotFoundException
      );
      expect(mockDeviceService.remove).toHaveBeenCalledWith(999);
    });
  });

  // Note: getStats method does not exist in DeviceController
  // Removing this test as the method is not implemented
});