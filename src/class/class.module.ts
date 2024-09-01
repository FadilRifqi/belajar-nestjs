import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { ClassSubject } from './entities/class-subject.entity';
import { ClassType } from './entities/class-type.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class, ClassType, ClassSubject, User])],
  providers: [ClassService],
  controllers: [ClassController],
})
export class ClassModule {}
