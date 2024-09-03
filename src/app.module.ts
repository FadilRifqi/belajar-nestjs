import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ClassModule } from './class/class.module';
import { Class } from './class/entities/class.entity';
import { ConfirmEmailToken } from './auth/entities/confirm-email.entity';
import { ClassType } from './class/entities/class-type.entity';
import { ClassSubject } from './class/entities/class-subject.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `config/${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Class, ConfirmEmailToken, ClassType, ClassSubject],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    ClassModule,
  ],
})
export class AppModule {}
