import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './create-user.dto';
import { User } from './user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser() {
    return this.userService.getUser();
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  addUser(@Body() userDto: UserDto) {
    const newUser: User = {
      id: 1, // Example ID generation
      name: userDto.name,
      password: userDto.password,
      created_at: new Date(),
      updated_at: new Date(),
    };
    return this.userService.addUser(newUser);
  }
}
