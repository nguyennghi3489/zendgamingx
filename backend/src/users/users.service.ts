import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}
  findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneByEmail(email);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  create(userData: Partial<User>): Promise<User> {
    return this.userRepository.create(userData);
  }
}
