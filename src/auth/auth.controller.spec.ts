import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { ExecutionContext } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue({}),
            confirmEmail: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .overrideGuard(LocalAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should register a user', async () => {
    const registerPayload = {
      email: 'fadilataullahrifqi@gmail.com',
      firstName: 'tes',
      lastName: 'user',
      password: 'password',
    };
    const result = await authController.register(registerPayload);
    expect(result).toEqual({});
  });

  it('should login a user', async () => {
    const req = { user: { id: 1, email: 'fadilataullahrifqi@gmail.com' } };
    const result = await authController.login(req as any);
    expect(result).toEqual(req.user);
  });

  it('should logout a user', async () => {
    const req = { user: { id: 1, email: 'fadilataullahrifqi@gmail.com' } };
    const result = await authController.logout(req as any);
    expect(result).toEqual(req.user);
  });

  it('should return session status', async () => {
    const req = { user: { id: 1, email: 'fadilataullahrifqi@gmail.com' } };
    const result = await authController.status(req as any);
    expect(result).toEqual(req.user);
  });

  it('should confirm email', async () => {
    const token = 'some-token';
    const res = { redirect: jest.fn() };

    await authController.confirmEmail(token, res as any);
    expect(res.redirect).toHaveBeenCalledWith(301, 'https://google.com');
  });
});
