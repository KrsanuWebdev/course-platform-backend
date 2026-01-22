import { Controller, Get, Post, Body, Query, Param, Put, Delete } from '@nestjs/common';
import { SubCategoryService } from '../services';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';

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
  findAllSubCategories(@Query() paginationDto: PaginationDto, @Query() filter: FilterSubCategoryDto) {
    return this._subCategoryService.findAllSubCategories(paginationDto, filter);
  }

  @ApiOperation({
    summary: 'Get a sub-category by ID',
  })
  @Get('sub-categorie/:subCategoryId')
  findOneSubCategoryById(@Param('subCategoryId') subCategoryId: string) {
    return this._subCategoryService.findOneSubCategoryById(subCategoryId);
  }

  @ApiOperation({
    summary: 'Update a sub-category by ID',
  })
  @Put('sub-categorie/:subCategoryId')
  updateSubCategoryById(@Param('subCategoryId') subCategoryId: string, @Body() updateSubCategoryDto: UpdateSubCategoryDto) {
    return this._subCategoryService.updateSubCategoryById(subCategoryId, updateSubCategoryDto);
  }

  @ApiOperation({
    summary: 'Delete a sub-category by ID',
  })
  @Delete('sub-categorie/:subCategoryId')
  deleteSubCategoryById(@Param('subCategoryId') subCategoryId: string) {
    return this._subCategoryService.deleteSubCategoryById(subCategoryId);
  }
}
