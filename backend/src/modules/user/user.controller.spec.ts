import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from '../../common/decorators/roles.decorator';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUser: User = {
    id: 1,
    phone: '13800138000',
    nickname: '测试用户',
    password: 'hashedPassword',
    role: UserRole.USER,
    avatar: null,
    balance: 0,
    status: 'active',
    storeId: null,
    staffRole: null,
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    orders: [],
    store: null,
    auditLogs: [],
  };

  const mockUserService = {
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByUsername: jest.fn(),
    validatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should get current user profile', async () => {
      const mockUser = {
        id: 1,
        phone: '13800138000',
        nickname: '测试用户',
        role: 'user',
        status: 'active'
      };
      const mockReq = { user: { userId: 1 } };
      
      mockUserService.findById.mockResolvedValue(mockUser);
      
      const result = await controller.getProfile(mockReq);
      
      expect(mockUserService.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [mockUser];
      mockUserService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll(1, 10);

      expect(mockUserService.findAll).toHaveBeenCalledWith(1, 10, undefined, undefined);
      expect(result).toEqual(mockUsers);
    });

     it('should handle empty user list', async () => {
       mockUserService.findAll.mockResolvedValue([]);

       const result = await controller.findAll(1, 10);

       expect(mockUserService.findAll).toHaveBeenCalledWith(1, 10, undefined, undefined);
       expect(result).toEqual([]);
     });
   });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const mockUser = { id: 1, phone: '13800138000', nickname: '测试用户' };
      
      mockUserService.findById.mockResolvedValue(mockUser);
      
      const result = await controller.findOne(1);
      
      expect(mockUserService.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserService.findById.mockRejectedValue(new NotFoundException('用户不存在'));
      
      await expect(controller.findOne(999)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should handle invalid id format', async () => {
      mockUserService.findById.mockRejectedValue(new NotFoundException('用户不存在'));
      
      await expect(controller.findOne(NaN)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      nickname: 'updateduser',
      avatar: 'updated-avatar.jpg',
    };

    it('should update a user', async () => {
      const updateUserDto = { nickname: '更新用户' };
      const mockUser = { 
        id: 1, 
        phone: '13800138000', 
        nickname: '更新用户',
        role: UserRole.USER,
        avatar: 'avatar.jpg',
        balance: 100,
        status: 'active',
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockUserService.update.mockResolvedValue(mockUser);
      
      const result = await controller.update(1, updateUserDto);
      
      expect(mockUserService.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual({
        id: mockUser.id,
        phone: mockUser.phone,
        nickname: mockUser.nickname,
        role: mockUser.role,
        avatar: mockUser.avatar,
        balance: mockUser.balance,
        status: mockUser.status,
        lastLoginAt: mockUser.lastLoginAt,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });

    it('should handle NotFoundException for update', async () => {
      const updateUserDto = { nickname: '更新用户' };
      mockUserService.update.mockRejectedValue(new NotFoundException('用户不存在'));

      await expect(controller.update(999, updateUserDto)).rejects.toThrow(NotFoundException);
      expect(mockUserService.update).toHaveBeenCalledWith(999, updateUserDto);
    });

    it('should handle invalid id format', async () => {
      mockUserService.update.mockRejectedValue(new NotFoundException('用户不存在'));
      
      await expect(controller.update(NaN, updateUserDto)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = await controller.remove(1);
      expect(mockUserService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: '用户删除成功' });
    });

    it('should handle NotFoundException for remove', async () => {
      mockUserService.remove.mockRejectedValue(new NotFoundException('用户不存在'));

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockUserService.remove).toHaveBeenCalledWith(999);
    });

    it('should handle invalid id format', async () => {
      mockUserService.remove.mockRejectedValue(new NotFoundException('用户不存在'));
      
      await expect(controller.remove(NaN)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});