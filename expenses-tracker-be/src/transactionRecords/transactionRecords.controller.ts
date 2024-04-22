import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { GetCurrentUserId } from '../common/decorators';
import { TransactionRecordsService } from './transactionRecords.service';
import { TransactionRecordEntity } from '../db/transactionRecords/transactionRecord.entity';
import { TransactionRecordDto } from '../db/transactionRecords/dto/transactionRecord.dto';

@Controller('transactionRecords')
@ApiTags('transactionRecords')
export class TransactionRecordsController {
  constructor(
    private readonly transactionRecordsService: TransactionRecordsService,
  ) {}

  @Post()
  @ApiCreatedResponse()
  create(
    @Body() transactionRecordDto: TransactionRecordDto,
    @GetCurrentUserId() userId: string,
  ) {
    return this.transactionRecordsService.create(transactionRecordDto, userId);
  }

  @Get()
  @ApiOkResponse({ type: TransactionRecordEntity, isArray: true })
  findAll(@GetCurrentUserId() userId: string) {
    return this.transactionRecordsService.findAll(userId);
  }

  @Delete(':id')
  @ApiOkResponse({ type: TransactionRecordEntity })
  remove(@Param('id') id: string, @GetCurrentUserId() userId: string) {
    return this.transactionRecordsService.remove(id, userId);
  }
}
