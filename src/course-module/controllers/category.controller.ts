import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoryService } from '../services';
import { CreateCategoryDto } from '../dtos';
import { ApiOperation } from '@nestjs/swagger';

@Controller('/')
export class CategoryController {
  constructor(private readonly _categoryService: CategoryService) {}

  @ApiOperation({
      summary: 'Create a new category',
    })
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this._categoryService.createCategory(createCategoryDto);
  }

  //   @Get()
  //   findAll(@Query() query: PaginationDto) {
  //     return this.categoryService.findAll(query);
  //   }

  //   @Get('with-subcategory-count')
  //   getWithSubCategoryCount() {
  //     return this.categoryService.getWithSubCategoryCount();
  //   }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.categoryService.findById(id);
  //   }

  //   @Put(':id')
  //   update(
  //     @Param('id') id: string,
  //     @Body() dto: UpdateCategoryDto,
  //   ) {
  //     return this.categoryService.update(id, dto);
  //   }

  //   @Delete(':id')
  //   @HttpCode(HttpStatus.NO_CONTENT)
  //   remove(@Param('id') id: string) {
  //     return this.categoryService.softDelete(id);
  //   }
}
