import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassDto } from './dto/class.dto';
import { User } from 'src/user/interfaces/user.interface';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async getAllClasses(user: User) {
    const classes = await this.classRepository.find({
      where: { userId: user.id },
    });
    return { message: 'Classes fetched successfully', data: classes };
  }

  async createClass(classDto: ClassDto, user: User) {
    const userId = user.id;
    const classPayload = { ...classDto, userId };
    const newClass = this.classRepository.create(classPayload);
    await this.classRepository.save(newClass);
    return { message: 'Class created successfully', data: classPayload };
  }
}
