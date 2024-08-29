import { Injectable } from '@nestjs/common';
import { User } from './user.interface';

@Injectable()
export class UserService {
  private readonly users: User[] = [];

  getAllUsers(): User[] {
    return this.users;
  }

  getUser(): { message: string } {
    return { message: 'Hello From User!' };
  }

  addUser(user: User) {
    this.users.push(user);
    return { message: 'User added successfully' };
  }
}
