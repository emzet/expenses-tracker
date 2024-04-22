import { Module } from '@nestjs/common';

import { TransactionRecordsController } from './transactionRecords.controller';
import { TransactionRecordsService } from './transactionRecords.service';
import { TransactionRecordsResolver } from './transactionRecords.resolver';
import { TransactionRecordsDbModule } from '../db/transactionRecords/transactionRecords.db.module';

@Module({
  controllers: [TransactionRecordsController],
  providers: [TransactionRecordsService, TransactionRecordsResolver],
  imports: [TransactionRecordsDbModule],
})
export class TransactionRecordsModule {}
