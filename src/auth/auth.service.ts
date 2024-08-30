import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import {
  LoginPayloadDto,
  RegisterPayloadDto,
  RefreshTokenDto,
} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;
  private readonly refreshTokenExpiry = '7d';

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  async register(authPayload: RegisterPayloadDto) {
    const { email, password, firstName, lastName } = authPayload;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    const newUser = this.userRepository.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

    return { message: 'User registered successfully' };
  }

  async validateUser(loginPayload: LoginPayloadDto) {
    const { email, password } = loginPayload;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isEmailConfirmed: user.isEmailConfirmed,
    };
    const accessToken = this.jwtService.sign(payload);

    // Generate a new refresh token
    const refreshToken = this.jwtService.sign({
      expiresIn: this.refreshTokenExpiry,
    });

    // Save refresh token in database
    await this.refreshTokenRepository.save({
      token: refreshToken,
      expiresAt: this.calculateExpiryDate(this.refreshTokenExpiry),
      user,
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    // Validate refresh token
    const tokenRecord = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });
    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Generate a new access token
    const user = tokenRecord.user;
    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isEmailConfirmed: user.isEmailConfirmed,
    };
    const newAccessToken = this.jwtService.sign(payload);

    return { accessToken: newAccessToken };
  }

  private calculateExpiryDate(expiry: string): Date {
    const [amount, unit] = expiry.match(/(\d+)([a-zA-Z]+)/).slice(1);
    const amountNumber = parseInt(amount, 10);
    const now = new Date();

    switch (unit) {
      case 'd': // days
        now.setDate(now.getDate() + amountNumber);
        break;
      case 'h': // hours
        now.setHours(now.getHours() + amountNumber);
        break;
      case 'm': // minutes
        now.setMinutes(now.getMinutes() + amountNumber);
        break;
      // Add more cases if needed
    }

    return now;
  }
}
