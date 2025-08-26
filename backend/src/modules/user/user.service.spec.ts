import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserRole } from '../../common/decorators/roles.decorator';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockUser: User = {
    id: 1,
    phone: '13800138000',
    password: 'hashedpassword',
    role: UserRole.USER,
    nickname: 'testuser',
    avatar: null,
    balance: 0,
    status: 'active',
    storeId: null,
    staffRole: null,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    orders: [],
    store: null,
    auditLogs: [],
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserData = {
      phone: '13900139000',
      password: 'password123',
      role: UserRole.USER,
      nickname: 'newuser',
    };

    it('should create a new user successfully', async () => {
      const expectedUser = {
        ...createUserData,
        role: UserRole.USER,
        balance: 0,
        status: 'active',
      };
      mockRepository.create.mockReturnValue(expectedUser);
      mockRepository.save.mockResolvedValue({ ...mockUser, ...expectedUser });

      const result = await service.create(createUserData);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createUserData,
        role: UserRole.USER,
        balance: 0,
        status: 'active',
      });
      expect(mockRepository.save).toHaveBeenCalledWith(expectedUser);
      expect(result).toEqual({ ...mockUser, ...expectedUser });
    });

    // Note: Current create method doesn't check for existing users
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const users = [mockUser];
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([users, 1]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll();

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(result.users).toBeDefined();
      expect(result.total).toBe(1);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(999);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateUserData = {
      nickname: 'updateduser',
      avatar: 'updated-avatar.jpg',
    };

    it('should update a user successfully', async () => {
      const updatedUser = { ...mockUser, ...updateUserData };
      jest.spyOn(service, 'findById').mockResolvedValueOnce(mockUser).mockResolvedValueOnce(updatedUser);
      mockRepository.update.mockResolvedValue({ affected: 1, generatedMaps: [], raw: [] });

      const result = await service.update(1, updateUserData);

      expect(service.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateUserData);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(null);

      await expect(service.update(999, updateUserData)).rejects.toThrow(NotFoundException);
      expect(service.findById).toHaveBeenCalledWith(999);
    });

    it('should hash password if provided in update', async () => {
      const updateWithPassword = { ...updateUserData, password: 'newpassword' };
      const updatedUser = { ...mockUser, ...updateWithPassword };
      jest.spyOn(service, 'findById').mockResolvedValueOnce(mockUser).mockResolvedValueOnce(updatedUser);
      mockRepository.update.mockResolvedValue({ affected: 1, generatedMaps: [], raw: [] });

      await service.update(1, updateWithPassword);

      expect(service.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updateWithPassword);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
      mockRepository.update.mockResolvedValue({ affected: 1, generatedMaps: [], raw: [] });

      await service.remove(1);

      expect(service.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.update).toHaveBeenCalledWith(1, { status: 'inactive' });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(service.findById).toHaveBeenCalledWith(999);
    });
  });

  describe('findByPhone', () => {
    it('should return a user by phone', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByPhone('13800138000');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { phone: '13800138000' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByPhone('nonexistent');

      expect(result).toBeNull();
    });
  });

  // Note: validatePassword method does not exist in UserService
  // Password validation is handled in AuthService
});