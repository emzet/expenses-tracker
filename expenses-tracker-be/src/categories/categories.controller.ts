import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from 'src/db/categories/category.entity';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { CategoryDto } from 'src/db/categories/dto/category.dto';

@Controller('categories')
@ApiTags('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiCreatedResponse()
  create(@Body() categoryDto: CategoryDto, @GetCurrentUserId() userId: string) {
    return this.categoriesService.create(categoryDto, userId);
  }

  @Get()
  @ApiOkResponse({ type: CategoryEntity, isArray: true })
  findAll(@GetCurrentUserId() userId: string) {
    return this.categoriesService.findAll(userId);
  }

  @Delete(':id')
  @ApiOkResponse({ type: CategoryEntity })
  remove(@Param('id') id: string, @GetCurrentUserId() userId: string) {
    return this.categoriesService.remove(id, userId);
  }
}
