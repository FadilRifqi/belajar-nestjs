import { Test, TestingModule } from '@nestjs/testing';
import { ClassService } from './class.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { ClassSubject } from './entities/class-subject.entity';
import { ClassType } from './entities/class-type.entity';
import { User } from 'src/user/entities/user.entity';

describe('ClassService', () => {
  let service: ClassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassService,
        {
          provide: getRepositoryToken(Class),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ClassSubject),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ClassType),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ClassService>(ClassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
