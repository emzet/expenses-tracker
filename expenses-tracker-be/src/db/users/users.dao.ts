import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { UserDto } from './dto/user.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersDao {
  constructor(private prisma: PrismaService) {}

  async create(createuserDto: UserDto) {
    try {
      const user = await this.prisma.user.create({ data: createuserDto });
      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException('User with given email already exists');
        }
      }
      throw e;
    }
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  logout(id: string) {
    return this.prisma.user.updateMany({
      where: {
        id,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  updateRt(id: string, rt: string) {
    return this.prisma.user.update({
      where: { id },
      data: { hashedRt: rt },
    });
  }
}
