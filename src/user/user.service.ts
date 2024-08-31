import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getAllUsers() {
    return 'Hello from User Service!';
  }

  getUser(): { message: string } {
    return { message: 'Hello From User!' };
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, user: Partial<User>): Promise<{ message: string }> {
    await this.userRepository.update(id, user);
    return { message: 'User updated successfully' };
  }
}
