import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { GetCurrentUserId } from 'src/common/decorators';
import { CreateCategoryInput } from 'src/graphql';

@Resolver('Categories')
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation('createCategory')
  create(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
    @GetCurrentUserId() userId: string,
  ) {
    return this.categoriesService.create(createCategoryInput, userId);
  }

  @Query('categories')
  findAll(@GetCurrentUserId() userId: string) {
    return this.categoriesService.findAll(userId);
  }

  @Mutation('removeCategory')
  remove(@Args('id') id: string, @GetCurrentUserId() userId: string) {
    return this.categoriesService.remove(id, userId);
  }
}
