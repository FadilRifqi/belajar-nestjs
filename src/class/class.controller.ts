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
import { User } from 'src/user/interfaces/user.interface';

@Controller('class')
@UseGuards(JwtAuthGuard)
export class ClassController {
  constructor(private classService: ClassService) {}

  @Get('all')
  async getAllClasses(@Req() req: Request) {
    const user = req.user as User;
    return this.classService.getAllClasses(user);
  }

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createClass(@Body() classDto: ClassDto, @Req() req: Request) {
    const user = req.user as User;
    return this.classService.createClass(classDto, user);
  }
}
