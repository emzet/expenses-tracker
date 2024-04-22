import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { TransactionRecordDto } from './dto/transactionRecord.dto';

@Injectable()
export class TransactionRecordsDao {
  constructor(private prisma: PrismaService) {}

  async create(transactionRecordDto: TransactionRecordDto, authorId: string) {
    try {
      const transactionRecord = await this.prisma.transactionRecord.create({
        data: { ...transactionRecordDto, authorId },
      });
      return transactionRecord;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2003') {
          throw new BadRequestException(
            'Category with given id does not exist',
          );
        }
      }
      throw e;
    }
  }

  findAll(authorId: string) {
    return this.prisma.transactionRecord.findMany({
      where: {
        OR: [{ authorId }, { shared: true }],
      },
    });
  }

  findOne(id: string) {
    return this.prisma.transactionRecord.findUnique({ where: { id } });
  }

  remove(id: string) {
    return this.prisma.transactionRecord.delete({ where: { id } });
  }
}
