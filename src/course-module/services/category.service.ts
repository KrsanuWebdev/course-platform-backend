import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { InjectModel } from '@nestjs/mongoose';
import { Category, SubCategory } from 'src/shared/models';
import { Model, Types } from 'mongoose';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { responseSortOrder } from 'src/shared/enums/common-enum';
import { FilterDto } from 'src/shared/dtos/filter.dto';
import { commanPaginationLogic } from 'src/shared/utils';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly _categoryModel: Model<Category>,

    @InjectModel(SubCategory.name)
    private readonly _subCategoryModel: Model<SubCategory>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this._categoryModel.findOne({
      categoryName: createCategoryDto.categoryName.trim(),
      isActive: true,
      isDeleted: false,
    });

    if (existingCategory) {
      throw new ConflictException(`Category '${createCategoryDto.categoryName}' already exists`);
    }
    const category = await this._categoryModel.create(createCategoryDto);
    const response = {
      message: 'Category created successfully',
      data: category,
    };
    return response;
  }

  async findAllCategories(paginationDto: PaginationDto, filterDto: FilterDto) {
    const { sortBy, sortOrder } = paginationDto;
    const { search, isActive = true } = filterDto;

    const filter: Record<string, any> = {};

    if (typeof isActive === 'boolean') {
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

    const [categories, total] = await Promise.all([query.exec(), this._categoryModel.countDocuments(filter)]);

    const categoryIds = categories.map((cat) => cat._id as Types.ObjectId);

    const subCategoryCounts = await this._subCategoryModel.aggregate([
      {
        $addFields: {
          categoryObjectId: {
            $cond: [{ $eq: [{ $type: '$categoryId' }, 'objectId'] }, '$categoryId', { $toObjectId: '$categoryId' }],
          },
        },
      },
      {
        $match: {
          categoryObjectId: { $in: categoryIds },
          isActive: true,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$categoryObjectId',
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map<string, number>();
    for (const item of subCategoryCounts) {
      countMap.set(item._id.toString(), item.count);
    }

    const categoriesWithCounts = categories.map((category: any) => ({
      ...category.toObject(),
      subCategoryCount: countMap.get(category._id.toString()) || 0,
    }));

    return {
      message: total > 0 ? 'Categories retrieved successfully' : 'No categories found',
      data: {
        total,
        categories: categoriesWithCounts,
      },
    };
  }

  async findOneCategoryById(categoryId: string) {
    const categoryObjectId = new Types.ObjectId(categoryId);

    const category = await this._categoryModel.findOne({
      _id: categoryObjectId,
      isActive: true,
      isDeleted: false,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const subCategoryCountResult = await this._subCategoryModel.aggregate([
      {
        $addFields: {
          categoryObjectId: {
            $cond: [{ $eq: [{ $type: '$categoryId' }, 'objectId'] }, '$categoryId', { $toObjectId: '$categoryId' }],
          },
        },
      },
      {
        $match: {
          categoryObjectId,
          isActive: true,
          isDeleted: false,
        },
      },
      {
        $count: 'count',
      },
    ]);

    const subCategoryCount = subCategoryCountResult.length > 0 ? subCategoryCountResult[0].count : 0;

    return {
      message: 'Category retrieved successfully',
      data: {
        ...category.toObject(),
        subCategoryCount,
      },
    };
  }

  async updateCategoryById(categoryId: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this._categoryModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(categoryId),
        isDeleted: false,
      },
      {
        $set: updateCategoryDto,
      },
    );
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const response = {
      message: 'Category updated successfully',
    };
    return response;
  }

  async deleteCategoryById(categoryId: string) {
    const category = await this._categoryModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(categoryId),

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
