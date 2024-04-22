import { Module } from '@nestjs/common';
import { CategoriesDbModule } from 'src/db/categories/categories.db.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesResolver } from './categories.resolver';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesResolver],
  imports: [CategoriesDbModule],
})
export class CategoriesModule {}
