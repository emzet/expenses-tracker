import { ConflictException, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryDto } from './dto/category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesDao {
  constructor(private prisma: PrismaService) {}

  async create(categoryDto: CategoryDto, authorId: string) {
    try {
      const category = await this.prisma.category.create({
        data: { ...categoryDto, authorId },
      });
      return category;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException(
            'Category with given title already exists',
          );
        }
      }
      throw e;
    }
  }

  findAll(authorId: string) {
    return this.prisma.category.findMany({
      where: {
        OR: [{ authorId }, { shared: true }],
      },
    });
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
