import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validatorUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (!user) return null;

    const match = await bcrypt.compare(pass, user.password);
    if (!match) return null;

    const { password, ...result } = user.toObject();
    return result;
  }

  async login(user: any) {
    const paylod = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(paylod),
    };
  }

  async logout() {
    return null;
  }
}
