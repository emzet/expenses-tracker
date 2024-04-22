import { ApiProperty } from '@nestjs/swagger';
import { TransactionRecord, TransactionType } from '@prisma/client';

export class TransactionRecordEntity implements TransactionRecord {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  date: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  title: string;

  @ApiProperty()
  type: TransactionType;

  authorId: string;

  shared: boolean;
}
