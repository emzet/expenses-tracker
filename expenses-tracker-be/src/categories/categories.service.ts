import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesDao } from 'src/db/categories/categories.dao';
import { CategoryEntity } from 'src/db/categories/category.entity';
import { CategoryDto } from 'src/db/categories/dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private categoriesDao: CategoriesDao) {}

  async create(
    categoryDto: CategoryDto,
    authorId: string,
  ): Promise<CategoryEntity> {
    return await this.categoriesDao.create(categoryDto, authorId);
  }

  findAll(userId: string) {
    return this.categoriesDao.findAll(userId);
  }

  async remove(id: string, userId: string) {
    const category = await this.categoriesDao.findOne(id);
    if (!category) {
      throw new NotFoundException('Category not found.');
    }
    if (category.authorId !== userId) {
      throw new ForbiddenException(
        "Can't touch this. You can delete only your own categories",
      );
    }
    return this.categoriesDao.remove(id);
  }
}
