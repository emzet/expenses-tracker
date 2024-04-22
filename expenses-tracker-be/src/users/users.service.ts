import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';

import { UserDto } from '../db/users/dto/user.dto';
import { UsersDao } from '../db/users/users.dao';
import { Tokens, User } from '../graphql';

@Injectable()
export class UsersService {
  constructor(private usersDao: UsersDao, private jwtService: JwtService) {}

  async signup(userDto: UserDto): Promise<Tokens> {
    const { email, password: _password } = userDto;
    const password = await this.hashData(_password);
    const user = await this.usersDao.create({ email, password });
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async signin(userDto: UserDto): Promise<Tokens> {
    const { email, password } = userDto;
    const user = await this.validateUser(email, password);
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(id: string) {
    return Boolean(await this.usersDao.logout(id));
  }

  async refreshToken(id: string, rt: string): Promise<Tokens> {
    const user = await this.usersDao.findOne(id);
    if (user?.hashedRt) {
      const rtMatches = await compare(rt, user.hashedRt);
      if (rtMatches) {
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
      }
    }
    throw new ForbiddenException('Access denied');
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.usersDao.updateRt(userId, hash);
  }

  async hashData(data: string): Promise<string> {
    return hash(data, 10);
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersDao.findByEmail(email);
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (user && (await compare(password, user.password))) {
      return user;
    }
    throw new ForbiddenException('Access denied');
  }
}
