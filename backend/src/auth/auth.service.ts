import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(user: SignUpDto): Promise<{ access_token: string; user: User }> {
    const isExistedUser = await this.usersService.findOneByEmail(user.email);
    if (isExistedUser) {
      throw new BadRequestException();
    }
    const userRecord = await this.usersService.create({
      ...user,
      password: '',
      role: 'user',
    });
    const payload = { sub: userRecord.id, username: userRecord.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: userRecord,
    };
  }
}
