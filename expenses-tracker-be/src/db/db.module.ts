import { Module } from '@nestjs/common';
import { UsersDbModule } from './users/users.db.module';
import { CategoriesDbModule } from './categories/categories.db.module';

@Module({
  imports: [UsersDbModule, CategoriesDbModule],
  exports: [UsersDbModule, CategoriesDbModule],
})
export class DbModule {}
