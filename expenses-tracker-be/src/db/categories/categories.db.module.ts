import { Module } from '@nestjs/common';
import { CategoriesDao } from './categories.dao';

@Module({
  providers: [CategoriesDao],
  exports: [CategoriesDao],
})
export class CategoriesDbModule {}
