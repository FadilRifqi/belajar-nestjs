import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { ClassDto } from './dto/class.dto';
import { UserInterface } from 'src/user/interfaces/user.interface';
import { ClassSubjectDto } from './dto/class-subject.dto';

@Controller('class')
@UseGuards(JwtAuthGuard)
export class ClassController {
  constructor(private classService: ClassService) {}

  @Get('all')
  async getAllClasses(@Req() req: Request) {
    const user = req.user as UserInterface;
    return this.classService.getAllClasses(user);
  }

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createClass(@Body() classDto: ClassDto, @Req() req: Request) {
    const user = req.user as UserInterface;
    return this.classService.createClass(classDto, user);
  }

  @Get('subject')
  async getClassSubjects(@Req() req: Request) {
    const user = req.user as UserInterface;
    return this.classService.getClassSubjects(user);
  }

  @Post('create-subject')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createClassSubject(
    @Body() classSubjectDto: ClassSubjectDto,
    @Req() req: Request,
  ) {
    const user = req.user as UserInterface;
    return this.classService.createClassSubject(classSubjectDto, user);
  }

  @Get('type')
  async getClassTypes() {
    return this.classService.getClassTypes();
  }
}
