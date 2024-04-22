import { Module } from '@nestjs/common';
import { UsersDao } from './users.dao';

@Module({
  providers: [UsersDao],
  exports: [UsersDao],
})
export class UsersDbModule {}
