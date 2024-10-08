import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import {
  LoginPayloadDto,
  RefreshTokenDto,
  RegisterPayloadDto,
  //   RefreshTokenDto,
} from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmEmailToken } from './entities/confirm-email.entity';
import { UserService } from 'src/user/user.service';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class AuthService {
  private saltRounds = 10;
  private refreshTokenExpiry = '7d';

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ConfirmEmailToken)
    private confirmEmailTokenRepository: Repository<ConfirmEmailToken>,
    private jwtService: JwtService,
    private userService: UserService,
    private mailerService: MailerService,
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

    return {
      message: 'User registered successfully.',
    };
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
      id: user.id,
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

  async createConfirmEmailToken(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.isEmailConfirmed) {
      throw new BadRequestException('User email already confirmed');
    }

    const existingToken = await this.confirmEmailTokenRepository.findOne({
      where: {
        user: { id: userId },
        expiresAt: MoreThan(new Date()),
        isActive: false,
      },
    });

    if (existingToken) {
      throw new BadRequestException(
        'A valid confirmation token already exists for this user',
      );
    }

    const token = uuidv4();
    const confirmEmailToken = this.confirmEmailTokenRepository.create({
      token,
      user,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    });

    await this.confirmEmailTokenRepository.save(confirmEmailToken);

    const confirmationUrl = `${process.env.BASE_URL}/auth/confirm-email/${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Email Confirmat ion',
      template: './confirmation', // path to your email template
      context: {
        name: user.firstName,
        confirmationUrl,
      },
    });

    return {
      message: 'Email confirmation token sent successfully',
    };
  }

  async confirmEmail(token: string) {
    const confirmEmailToken = await this.confirmEmailTokenRepository.findOne({
      where: { token, isActive: true },
      relations: ['user'],
    });
    if (!confirmEmailToken) {
      throw new BadRequestException(
        'Invalid or expired email confirmation token',
      );
    }

    const now = new Date();
    if (confirmEmailToken.expiresAt < now) {
      throw new BadRequestException('Email confirmation token has expired');
    }

    const user = confirmEmailToken.user;
    user.isEmailConfirmed = true;
    await this.userService.update(user.id, user);
    confirmEmailToken.isActive = false;
    await this.confirmEmailTokenRepository.save(confirmEmailToken);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const user = await this.userService.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailConfirmed: user.isEmailConfirmed,
      };

      const newAccessToken = this.jwtService.sign(newPayload);

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token', error.message);
    }
  }
}
