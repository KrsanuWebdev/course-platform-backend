import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/shared/models';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { responseSortOrder } from 'src/shared/enums/common-enum';
import { FilterDto } from 'src/shared/dtos/filter.dto';
import { commanPaginationLogic } from 'src/shared/utils';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly _categoryModel: Model<Category>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const category = await this._categoryModel.create(createCategoryDto);
    const response = {
      message: 'Category created successfully',
      data: category,
    };
    return response;
  }

  async findAllCategories(paginationDto: PaginationDto, filterDto: FilterDto) {
    const { sortBy, sortOrder } = paginationDto;
    const { search, isActive } = filterDto;

    const filter: Record<string, any> = {};

    if (isActive) {
      filter.isActive = isActive;
    }

    if (search) {
      filter.categoryName = { $regex: search, $options: 'i' };
    }
   
    const query = this._categoryModel.find(filter);

    if (sortBy) {
      query.sort({
        [sortBy]: sortOrder === responseSortOrder.ASC ? 1 : -1,
      });
    } else {
      query.sort({ createdAt: -1 });
    }

    const { limit, skip } = commanPaginationLogic(paginationDto);

    query.skip(skip).limit(limit);

    const [categories, total] = await Promise.all([
      query.exec(),
      this._categoryModel.countDocuments(filter),
    ]);

    const response = {
      message:
        total > 0 ? 'Categories retrieved successfully' : 'No categories found',
      data: { total, categories },
    };
    return response;
  }

  async findOneCategoryById(categorieId: string) {
    const category = await this._categoryModel.findById(categorieId);
    if (!category) {
      throw new Error('Category not found');
    }
    const response = {
      message: 'Category retrieved successfully',
      data: category,
    };
    return response;
  }

  async updateCategoryById(
    categorieId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this._categoryModel.findByIdAndUpdate(
      categorieId,
      updateCategoryDto,
      { new: true },
    );
    if (!category) {
      throw new Error('Category not found');
    }
    const response = {
      message: 'Category updated successfully',
      data: category,
    };
    return response;
  }

  async deleteCategoryById(categoryId: string) {
    const category = await this._categoryModel.findOneAndUpdate(
      {
        categoryId,
        isDeleted: false,
      },
      {
        $set: {
          isActive: false,
          isDeleted: true,
        },
      },
      {
        new: true,
      },
    );

    if (!category) {
      throw new NotFoundException('Category not found or already deleted');
    }

    const response = {
      message: 'Category deleted successfully',
    };
    return response;
  }
}
