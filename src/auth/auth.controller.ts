import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterPayloadDto } from './dto/auth.dto';
import { ValidationPipe } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createUserDto: RegisterPayloadDto,
  ) {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request) {
    return req.user;
  }

  @Get('session')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }
  //   @Post('refresh-token')
  //   async refreshToken(@Query('token') refreshTokenDto: RefreshTokenDto) {
  //     return await this.authService.refreshToken(refreshTokenDto);
  //   }
}
