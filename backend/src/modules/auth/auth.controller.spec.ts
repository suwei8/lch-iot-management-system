import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register admin user successfully', async () => {
      const registerDto: RegisterDto = {
        phone: '13800138000',
        password: 'Admin123!',
        nickname: 'admin',
      };

      const mockResponse = {
        success: true,
        message: '注册成功',
        data: {
          user: {
            id: 'uuid-string',
            phone: '13800138003',
            email: 'admin@example.com',
            role: 'admin',
            status: 'active',
            createdAt: new Date(),
          },
        },
        timestamp: new Date(),
      };

      mockAuthService.register.mockResolvedValue(mockResponse);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockResponse);
    });

    it('should register merchant user successfully', async () => {
      const registerDto: RegisterDto = {
        phone: '13800138005',
        password: 'Merchant123!',
        nickname: 'merchant',
      };

      const mockResponse = {
        success: true,
        message: '注册成功',
        data: {
          user: {
            id: 'uuid-string',
            phone: '13800138005',
            email: 'merchant@example.com',
            role: 'merchant',
            status: 'active',
            createdAt: new Date(),
          },
        },
        timestamp: new Date(),
      };

      mockAuthService.register.mockResolvedValue(mockResponse);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockResponse);
    });

    it('should handle registration error when username exists', async () => {
      const registerDto: RegisterDto = {
        phone: '13800138006',
        nickname: 'existinguser',
        password: 'Password123!',
      };

      const mockError = {
        success: false,
        message: '用户名已存在',
        error: {
          code: 'USER_EXISTS',
          details: '该用户名已被注册',
        },
        timestamp: new Date(),
      };

      mockAuthService.register.mockRejectedValue(mockError);

      await expect(controller.register(registerDto)).rejects.toEqual(mockError);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should handle registration error when email exists', async () => {
      const registerDto: RegisterDto = {
        phone: '13800138002',
        nickname: 'newuser',
        password: 'Password123!',
      };

      const mockError = {
        success: false,
        message: '邮箱已存在',
        error: {
          code: 'EMAIL_EXISTS',
          details: '该邮箱已被注册',
        },
        timestamp: new Date(),
      };

      mockAuthService.register.mockRejectedValue(mockError);

      await expect(controller.register(registerDto)).rejects.toEqual(mockError);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login admin user successfully with username', async () => {
      const loginDto: LoginDto = {
        phone: '13800138008',
        password: 'Admin123!',
      };

      const mockResponse = {
        success: true,
        message: '登录成功',
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'refresh-token-string',
          user: {
            id: 'uuid-string',
            phone: '13800138009',
            email: 'admin@example.com',
            role: 'admin',
            status: 'active',
            lastLoginAt: new Date(),
          },
          expiresIn: 3600,
        },
        timestamp: new Date(),
      };

      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockResponse);
    });

    it('should login merchant user successfully with email', async () => {
      const loginDto: LoginDto = {
        phone: '13800138004',
        password: 'Merchant123!',
      };

      const mockResponse = {
        success: true,
        message: '登录成功',
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'refresh-token-string',
          user: {
            id: 'uuid-string',
            phone: '13800138007',
            email: 'merchant@example.com',
            role: 'merchant',
            status: 'active',
            lastLoginAt: new Date(),
          },
          expiresIn: 3600,
        },
        timestamp: new Date(),
      };

      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockResponse);
    });

    it('should handle login error with invalid credentials', async () => {
      const loginDto: LoginDto = {
        phone: '13800138010',
        password: 'wrongpassword',
      };

      const mockError = {
        success: false,
        message: '用户名或密码错误',
        error: {
          code: 'INVALID_CREDENTIALS',
          details: '提供的登录凭据无效',
        },
        timestamp: new Date(),
      };

      mockAuthService.login.mockRejectedValue(mockError);

      await expect(controller.login(loginDto)).rejects.toEqual(mockError);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should handle login error with disabled account', async () => {
      const loginDto: LoginDto = {
        phone: '13800138001',
        password: 'Password123!',
      };

      const mockError = {
        success: false,
        message: '账户已被禁用',
        error: {
          code: 'ACCOUNT_DISABLED',
          details: '该账户已被管理员禁用',
        },
        timestamp: new Date(),
      };

      mockAuthService.login.mockRejectedValue(mockError);

      await expect(controller.login(loginDto)).rejects.toEqual(mockError);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should handle login error with non-existent user', async () => {
      const loginDto: LoginDto = {
        phone: '13800138000',
        password: 'Password123!',
      };

      const mockError = {
        success: false,
        message: '用户不存在',
        error: {
          code: 'USER_NOT_FOUND',
          details: '该用户名未注册',
        },
        timestamp: new Date(),
      };

      mockAuthService.login.mockRejectedValue(mockError);

      await expect(controller.login(loginDto)).rejects.toEqual(mockError);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});