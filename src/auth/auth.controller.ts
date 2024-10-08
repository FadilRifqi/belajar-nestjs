import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto, RegisterPayloadDto } from './dto/auth.dto';
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

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request) {
    return req.user;
  }

  @Get('session')
  @UseGuards(JwtAuthGuard)
  status(@Req() req: Request) {
    return req.user;
  }

  @Post('create-confirm-email-token')
  async createConfirmEmailToken(@Body('id') id: number) {
    if (!id) {
      throw new BadRequestException('No user id provided');
    }

    return await this.authService.createConfirmEmailToken(id);
  }

  @Post('confirm-email/:token')
  async confirmEmail(@Param('token') token: string, @Res() res: any) {
    await this.authService.confirmEmail(token);
    res.redirect(301, `${process.env.FRONTEND_URL}/refresh-token`);
  }
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshTokenDto);
  }
}
