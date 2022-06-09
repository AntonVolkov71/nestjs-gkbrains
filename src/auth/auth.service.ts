import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersEntity } from '../users/users.entity';
import { compare } from '../utils/crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UsersEntity | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await compare(pass, user.password))) {
      return user;
    }
  }

  async login(user: any) {
    const payload = user;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verify(token: string) {
    return this.jwtService.verify(token);
  }
}
