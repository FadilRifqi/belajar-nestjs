import { Controller, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginPayloadDto,
  RefreshTokenDto,
  RegisterPayloadDto,
} from './dto/auth.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createUserDto: RegisterPayloadDto,
  ) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    loginPayload: LoginPayloadDto,
  ) {
    return this.authService.validateUser(loginPayload);
  }

  @Post('refresh-token')
  async refreshToken(@Query('token') refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
