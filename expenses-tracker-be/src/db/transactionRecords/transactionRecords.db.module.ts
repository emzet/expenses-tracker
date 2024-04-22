import { Module } from '@nestjs/common';

import { TransactionRecordsDao } from './transactionRecords.dao';

@Module({
  providers: [TransactionRecordsDao],
  exports: [TransactionRecordsDao],
})
export class TransactionRecordsDbModule {}
