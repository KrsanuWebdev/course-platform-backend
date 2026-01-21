import { Controller, Get, Post, Body, Query, Param, Put, Delete } from '@nestjs/common';
import { CategoryService } from '../services';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { FilterDto } from 'src/shared/dtos/filter.dto';

@ApiTags('Category Module')
@Controller('/')
export class CategoryController {
  constructor(private readonly _categoryService: CategoryService) {}

  @ApiOperation({
    summary: 'Create a new category',
  })
  @Post('categorie')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this._categoryService.createCategory(createCategoryDto);
  }

  @ApiOperation({
    summary: 'Get all categories',
  })
  @Get('categories')
  findAllCategories(@Query() query: PaginationDto, @Query() filter: FilterDto) {
    return this._categoryService.findAllCategories(query, filter);
  }

  @ApiOperation({
    summary: 'Get a category by ID',
  })
  @Get('categorie/:categorieId')
  findOneCategoryById(@Param('categorieId') categorieId: string) {
    return this._categoryService.findOneCategoryById(categorieId);
  }

    @ApiOperation({
      summary: 'Update a category by ID',
    })
    @Put('categorie/:categorieId')
    updateCategoryById(
      @Param('categorieId') categorieId: string,
      @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
      return this._categoryService.updateCategoryById(categorieId, updateCategoryDto);
    }

  @ApiOperation({
      summary: 'Delete a category by ID',
    })
    @Delete('categorie/:categorieId')
    deleteCategoryById(@Param('categorieId') categorieId: string) {
      return this._categoryService.deleteCategoryById(categorieId);
    }
}
