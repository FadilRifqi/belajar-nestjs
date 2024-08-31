import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import {
  LoginPayloadDto,
  RegisterPayloadDto,
  //   RefreshTokenDto,
} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private saltRounds = 10;
  private refreshTokenExpiry = '7d';

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
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

  async validateUser({ email, password }: LoginPayloadDto) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isEmailConfirmed: user.isEmailConfirmed,
    };
    const accessToken = this.jwtService.sign(payload);

    // Generate a new refresh token
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.refreshTokenExpiry,
    });

    return { accessToken, refreshToken };
  }

  //   async refreshToken(refreshTokenDto: RefreshTokenDto) {
  //     return { message: 'Refresh token endpoint' };
  //   }
}
