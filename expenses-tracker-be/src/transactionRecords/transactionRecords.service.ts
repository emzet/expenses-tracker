import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { TransactionRecordsDao } from '../db/transactionRecords/transactionRecords.dao';
import { TransactionRecordEntity } from '../db/transactionRecords/transactionRecord.entity';
import { TransactionRecordDto } from '../db/transactionRecords/dto/transactionRecord.dto';

@Injectable()
export class TransactionRecordsService {
  constructor(private transactionRecordsDao: TransactionRecordsDao) {}

  async create(
    transactionRecordDto: TransactionRecordDto,
    author: string,
  ): Promise<TransactionRecordEntity> {
    return await this.transactionRecordsDao.create(
      transactionRecordDto,
      author,
    );
  }

  findAll(userId: string) {
    return this.transactionRecordsDao.findAll(userId);
  }

  async remove(id: string, userId: string) {
    const transactionRecord = await this.transactionRecordsDao.findOne(id);
    if (!transactionRecord) {
      throw new NotFoundException('Transaction record not found.');
    }
    if (transactionRecord.authorId !== userId) {
      throw new ForbiddenException(
        "Can't touch this. You can delete only your own transaction records.",
      );
    }
    return this.transactionRecordsDao.remove(id);
  }
}
