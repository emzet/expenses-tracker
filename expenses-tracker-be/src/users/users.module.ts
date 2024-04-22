import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';
import { UsersDbModule } from 'src/db/users/users.db.module';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersResolver, AtStrategy, RtStrategy, JwtService],
  imports: [UsersDbModule],
})
export class UsersModule {}
