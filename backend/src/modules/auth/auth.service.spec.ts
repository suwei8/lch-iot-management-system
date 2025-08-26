import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../../common/decorators/roles.decorator';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

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

  const mockUserService = {
    findByPhone: jest.fn(),
    validatePassword: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    updateLastLogin: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // validateUser method does not exist in AuthService
  // Password validation is handled directly in the login method
  /*
  describe('validateUser', () => {
    it('should return user data for valid credentials', async () => {
      mockUserService.findByPhone.mockResolvedValue(mockUser);
      mockUserService.validatePassword.mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'password123');

      expect(userService.findByPhone).toHaveBeenCalledWith('testuser');
      expect(userService.validatePassword).toHaveBeenCalledWith('password123', mockUser.password);
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
        isActive: mockUser.isActive,
      });
    });

    it('should return null for invalid username', async () => {
      mockUserService.findByPhone.mockResolvedValue(null);

      const result = await service.validateUser('invaliduser', 'password123');

      expect(userService.findByPhone).toHaveBeenCalledWith('invaliduser');
      expect(result).toBeNull();
    });

    it('should return null for invalid password', async () => {
      mockUserService.findByPhone.mockResolvedValue(mockUser);
      mockUserService.validatePassword.mockResolvedValue(false);

      const result = await service.validateUser('testuser', 'wrongpassword');

      expect(userService.findByPhone).toHaveBeenCalledWith('testuser');
      expect(userService.validatePassword).toHaveBeenCalledWith('wrongpassword', mockUser.password);
      expect(result).toBeNull();
    });

    it('should return null for inactive user', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      mockUserService.findByPhone.mockResolvedValue(inactiveUser);
      mockUserService.validatePassword.mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'password123');

      expect(result).toBeNull();
    });
  });
  */

  describe('login', () => {
    const loginDto: LoginDto = {
      phone: '13800138000',
      password: 'password123',
    };

    it('should return access token for valid credentials', async () => {
      mockUserService.findByPhone.mockResolvedValue(mockUser);
      mockUserService.updateLastLogin.mockResolvedValue(undefined);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');
      
      // Mock bcrypt.compare to return true
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(mockUserService.findByPhone).toHaveBeenCalledWith(loginDto.phone);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(mockUserService.updateLastLogin).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          phone: mockUser.phone,
          nickname: mockUser.nickname,
          role: mockUser.role,
          balance: mockUser.balance,
          status: mockUser.status,
          lastLoginAt: expect.any(Date),
        },
        token: 'mock-jwt-token',
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockUserService.findByPhone.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockUserService.findByPhone).toHaveBeenCalledWith(loginDto.phone);
    });
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      phone: '13800138001',
      password: 'password123',
      nickname: 'newuser',
    };

    it('should register a new user successfully', async () => {
      const createdUser = { ...mockUser, ...registerDto };
      mockUserService.findByPhone.mockResolvedValue(null); // 用户不存在
      mockUserService.create.mockResolvedValue(createdUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.register(registerDto);

      expect(userService.findByPhone).toHaveBeenCalledWith(registerDto.phone);
      expect(userService.create).toHaveBeenCalledWith({
        phone: registerDto.phone,
        password: expect.any(String), // 哈希后的密码
        nickname: registerDto.nickname,
        role: UserRole.USER,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        userId: createdUser.id,
        phone: createdUser.phone,
        role: createdUser.role,
      }, {
        expiresIn: '7d',
      });
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
    });

    it('should throw ConflictException if phone already exists', async () => {
      mockUserService.findByPhone.mockResolvedValue(mockUser); // 用户已存在

      await expect(service.register(registerDto)).rejects.toThrow('手机号已被注册');
      expect(userService.findByPhone).toHaveBeenCalledWith(registerDto.phone);
      expect(userService.create).not.toHaveBeenCalled();
    });
  });

  describe('validateToken', () => {
    it('should validate token successfully', async () => {
      const mockPayload = { userId: 1, phone: '13800138000', role: 'user' };
      const testUser = { 
        id: 1, 
        phone: '13800138000',
        nickname: '测试用户',
        role: 'user',
        status: 'active' 
      };
      
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUserService.findById.mockResolvedValue(testUser);

      const result = await service.validateToken('validToken');

      expect(mockJwtService.verify).toHaveBeenCalledWith('validToken');
      expect(mockUserService.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        userId: 1,
        phone: '13800138000',
        role: 'user',
        nickname: '测试用户',
      });
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.validateToken('invalidToken')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      const mockPayload = { userId: 1, phone: '13800138000', role: 'user' };
      const inactiveUser = { 
        id: 1, 
        phone: '13800138000',
        nickname: '测试用户',
        role: 'user',
        status: 'inactive' 
      };
      
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUserService.findById.mockResolvedValue(inactiveUser);

      await expect(service.validateToken('validToken')).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  // Note: refreshToken method and tests removed as the method does not exist in AuthService
});