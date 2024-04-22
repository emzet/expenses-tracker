import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { TransactionRecordsService } from './transactionRecords.service';
import { GetCurrentUserId } from '../common/decorators';
import { TransactionRecordDto } from '../db/transactionRecords/dto/transactionRecord.dto';

@Resolver('TransactionRecords')
export class TransactionRecordsResolver {
  constructor(
    private readonly transactionRecordsService: TransactionRecordsService,
  ) {}

  @Mutation('createTransactionRecord')
  create(
    @Args('createTransactionRecordInput')
    createTransactionRecordInput: TransactionRecordDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.transactionRecordsService.create(
      createTransactionRecordInput,
      userId,
    );
  }

  @Query('transactionRecords')
  findAll(@GetCurrentUserId() userId: string) {
    return this.transactionRecordsService.findAll(userId);
  }

  @Mutation('removeTransactionRecord')
  remove(@Args('id') id: string, @GetCurrentUserId() userId: string) {
    return this.transactionRecordsService.remove(id, userId);
  }
}
