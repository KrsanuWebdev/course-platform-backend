import { Controller, Get, Post, Body, Query, Param, Put, Delete } from '@nestjs/common';
import { SubCategoryService } from '../services';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { FilterDto } from 'src/shared/dtos/filter.dto';
import { CreateSubCategoryDto, FilterSubCategoryDto, UpdateSubCategoryDto } from '../dtos';

@ApiTags('SubCategory Module')
@Controller('/')
export class SubCategoryController {
  constructor(private readonly _subCategoryService: SubCategoryService) {}

  @ApiOperation({
    summary: 'Create a new sub-category',
  })
  @Post('sub-categorie')
  async createSubCategory(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return await this._subCategoryService.createSubCategory(createSubCategoryDto);
  }

  @ApiOperation({
    summary: 'Get all sub-categories',
  })
  @Get('sub-categories')
  findAllSubCategories(@Query() query: PaginationDto, @Query() filter: FilterSubCategoryDto) {
    return this._subCategoryService.findAllSubCategories(query, filter);
  }

  @ApiOperation({
    summary: 'Get a sub-category by ID',
  })
  @Get('sub-categorie/:subCategorieId')
  findOneSubCategoryById(@Param('subCategorieId') subCategorieId: string) {
    return this._subCategoryService.findOneSubCategoryById(subCategorieId);
  }

  @ApiOperation({
    summary: 'Update a sub-category by ID',
  })
  @Put('sub-categorie/:subCategorieId')
  updateSubCategoryById(@Param('subCategorieId') subCategorieId: string, @Body() updateSubCategoryDto: UpdateSubCategoryDto) {
    return this._subCategoryService.updateSubCategoryById(subCategorieId, updateSubCategoryDto);
  }

  @ApiOperation({
    summary: 'Delete a sub-category by ID',
  })
  @Delete('sub-categorie/:subCategorieId')
  deleteSubCategoryById(@Param('subCategorieId') subCategorieId: string) {
    return this._subCategoryService.deleteSubCategoryById(subCategorieId);
  }
}
