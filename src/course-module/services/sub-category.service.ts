import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from '../dtos';
import { InjectModel } from '@nestjs/mongoose';
import { Category, SubCategory } from 'src/shared/models';
import { Model } from 'mongoose';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { responseSortOrder } from 'src/shared/enums/common-enum';
import { FilterDto } from 'src/shared/dtos/filter.dto';
import { commanPaginationLogic } from 'src/shared/utils';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name)
    private readonly _subCategoryModel: Model<SubCategory>,
    @InjectModel(Category.name)
    private readonly _categoryModel: Model<Category>,
  ) {}

  async createSubCategory(createSubCategoryDto: CreateSubCategoryDto) {
    const { categoryId, subCategoryName } = createSubCategoryDto;

    const category = await this._categoryModel.findOne({
      categoryId,
      isActive: true,
      isDeleted: false,
    });

    if (!category) {
      throw new NotFoundException('Category  does not exist or is inactive');
    }

    const existingSubCategory = await this._subCategoryModel.findOne({
      categoryId,
      subCategoryName: subCategoryName.trim(),
      isActive: true,
      isDeleted: false,
    });

    if (existingSubCategory) {
      throw new ConflictException(`Sub-category '${subCategoryName}' already exists under this category`);
    }

    const subCategory = await this._subCategoryModel.create({
      categoryId,
      subCategoryName: subCategoryName.trim(),
      isActive: true,
      isDeleted: false,
    });

    const response = {
      message: 'Sub-category created successfully',
      data: subCategory,
    };

    return response;
  }

  async findAllSubCategories(paginationDto: PaginationDto, filterDto: FilterDto) {
    const { sortBy, sortOrder } = paginationDto;
    const { search, isActive } = filterDto;

    const filter: Record<string, any> = {};

    if (isActive) {
      filter.isActive = isActive;
    }

    if (search) {
      filter.subCategoryName = { $regex: search, $options: 'i' };
    }

    const query = this._subCategoryModel.find(filter);

    if (sortBy) {
      query.sort({
        [sortBy]: sortOrder === responseSortOrder.ASC ? 1 : -1,
      });
    } else {
      query.sort({ createdAt: -1 });
    }

    const { limit, skip } = commanPaginationLogic(paginationDto);

    query.skip(skip).limit(limit);

    const [subCategories, total] = await Promise.all([query.exec(), this._subCategoryModel.countDocuments(filter)]);

    const response = {
      message: total > 0 ? 'Sub-categories retrieved successfully' : 'No sub-categories found',
      data: { total, subCategories },
    };
    return response;
  }

  async findOneSubCategoryById(subCategorieId: string) {
    const subCategory = await this._subCategoryModel.findById(subCategorieId);
    if (!subCategory) {
      throw new NotFoundException('Sub-category not found');
    }
    const response = {
      message: 'Sub-category retrieved successfully',
      data: subCategory,
    };
    return response;
  }

  async updateSubCategoryById(subCategorieId: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    const subCategory = await this._subCategoryModel.findByIdAndUpdate(subCategorieId, updateSubCategoryDto, { new: true });
    if (!subCategory) {
      throw new NotFoundException('Sub-category not found');
    }
    const response = {
      message: 'Sub-category updated successfully',
      data: subCategory,
    };
    return response;
  }

  async deleteSubCategoryById(subCategoryId: string) {
    const subCategory = await this._subCategoryModel.findOneAndUpdate(
      {
        subCategoryId,
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

    if (!subCategory) {
      throw new NotFoundException('Sub-category not found or already deleted');
    }

    const response = {
      message: 'Sub-category deleted successfully',
    };
    return response;
  }
}
