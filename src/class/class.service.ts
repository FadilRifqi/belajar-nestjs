import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassDto } from './dto/class.dto';
import { UserInterface } from 'src/user/interfaces/user.interface';
import { ClassSubjectDto } from './dto/class-subject.dto';
import { ClassSubject } from './entities/class-subject.entity';
import { ClassType } from './entities/class-type.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(ClassSubject)
    private classSubjectRepository: Repository<ClassSubject>,
    @InjectRepository(ClassType)
    private classTypeRepository: Repository<ClassType>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllClasses(user: UserInterface) {
    const classes = await this.classRepository.find({
      where: { userId: user.id },
      relations: ['classSubject', 'classType'],
    });
    return { message: 'Classes fetched successfully', data: classes };
  }

  async createClass(classDto: ClassDto, user: UserInterface) {
    const userId = user.id;
    const { classTypeId, classSubjectId } = classDto;
    const classType = await this.classTypeRepository.findOne({
      where: { id: classTypeId },
    });
    if (!classType) {
      throw new NotFoundException('Class type not found');
    }
    const classSubject = await this.classSubjectRepository.findOne({
      where: { id: classSubjectId },
    });
    if (!classSubject) {
      throw new NotFoundException('Class subject not found');
    }
    const classEntity = this.classRepository.create({
      ...classDto,
      userId,
      classType,
      classSubject,
    });
    this.classRepository.save(classEntity);
    return { message: 'Class created successfully' };
  }

  async createClassSubject(
    classSubjectDto: ClassSubjectDto,
    user: UserInterface,
  ) {
    const classSubject = this.classSubjectRepository.create({
      ...classSubjectDto,
      user,
    });
    this.classSubjectRepository.save(classSubject);
    return { message: 'Class subject created successfully' };
  }

  async getClassSubjects(user: UserInterface) {
    const userId = user.id;
    const classSubjects = await this.classSubjectRepository.find({
      where: { user: { id: userId } },
    });
    return {
      message: 'Class subjects fetched successfully',
      data: classSubjects,
    };
  }

  async getClassTypes() {
    const classTypes = await this.classTypeRepository.find();
    return { message: 'Class types fetched successfully', data: classTypes };
  }
}
