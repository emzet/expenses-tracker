import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from './prisma/prisma.module';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionRecordsModule } from './transactionRecords/transactionRecords.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    CategoriesModule,
    TransactionRecordsModule,
    DbModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      context: ({ req, connection }) => {
        return connection ? { req: connection.context } : { req };
      },
    }),
    JwtModule.register({}),
  ],
})
export class AppModule {}
