import { Test, TestingModule } from '@nestjs/testing';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ExecutionContext } from '@nestjs/common';

describe('ClassController', () => {
  let classController: ClassController;
  let classService: ClassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassController],
      providers: [
        {
          provide: ClassService,
          useValue: {
            getAllClasses: jest.fn().mockResolvedValue([]),
            createClass: jest.fn().mockResolvedValue({}),
            getClassSubjects: jest.fn().mockResolvedValue([]),
            createClassSubject: jest.fn().mockResolvedValue({}),
            getClassTypes: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    classController = module.get<ClassController>(ClassController);
    classService = module.get<ClassService>(ClassService);
  });

  it('should be defined', () => {
    expect(classController).toBeDefined();
  });

  it('should return all classes', async () => {
    const req = { user: { id: 1 } };
    const result = await classController.getAllClasses(req as any);
    expect(result).toEqual([]);
  });

  it('should create a class', async () => {
    const req = { user: { id: 1 } };
    const classDto = {
      day: 'Monday',
      classSubjectId: 1,
      classTypeId: 1,
      startTime: '09:00',
      endTime: '10:00',
    };
    const result = await classController.createClass(classDto, req as any);
    expect(result).toEqual({});
  });

  it('should return class subjects', async () => {
    const req = { user: { id: 1 } };
    const result = await classController.getClassSubjects(req as any);
    expect(result).toEqual([]);
  });

  it('should create a class subject', async () => {
    const req = { user: { id: 1 } };
    const classSubjectDto = { name: 'Math', code: 'MTH' };
    const result = await classController.createClassSubject(
      classSubjectDto,
      req as any,
    );
    expect(result).toEqual({});
  });

  it('should return class types', async () => {
    const result = await classController.getClassTypes();
    expect(result).toEqual([]);
  });
});
