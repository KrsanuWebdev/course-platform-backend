import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { Category, SubCategory, Course } from '../models';

@Injectable()
export class CourseHelpherService {
  constructor(
    @InjectModel(Category.name)
    private readonly _categoryModel: Model<Category>,
    @InjectModel(SubCategory.name)
    private readonly _subCategoryModel: Model<SubCategory>,
    @InjectModel(Course.name)
    private readonly _courseModel: Model<Course>,
  ) {}


  public async validateCategories(categoryIds: string[], session?: ClientSession) {
    const uniqueIds = [...new Set(categoryIds)];
    const objectIds = uniqueIds.map((id) => new Types.ObjectId(id));

    const categories = await this._categoryModel.find({ _id: { $in: objectIds }, isActive: true, isDeleted: false }).session(session);

    if (categories.length !== uniqueIds.length) {
      throw new BadRequestException('One or more categories are invalid or inactive');
    }

    return categories;
  }

  public async validateSubCategories(subCategoryIds: string[], allowedCategoryIds: string[], session?: ClientSession) {
    if (!subCategoryIds.length) return [];

    const uniqueIds = [...new Set(subCategoryIds)];
    const objectIds = uniqueIds.map((id) => new Types.ObjectId(id));

    const subCategories = await this._subCategoryModel.find({ _id: { $in: objectIds }, isActive: true, isDeleted: false }).session(session);

    if (subCategories.length !== uniqueIds.length) {
      throw new BadRequestException('One or more sub-categories are invalid or inactive');
    }

    const allowedSet = new Set(allowedCategoryIds.map(String));

    for (const sc of subCategories) {
      if (!allowedSet.has(sc.categoryId.toString())) {
        throw new BadRequestException('All selected sub-categories must belong to the selected categories');
      }
    }

    return subCategories;
  }
  public async validateCourseNameUniqueness(courseName: string, categoryIds: string[], subCategoryIds?: string[], excludeCourseId?: string, session?: ClientSession) {
    const query: any = {
      courseName,
      isDeleted: false,
      categories: {
        $in: categoryIds.map((id) => new Types.ObjectId(id)),
      },
    };

    if (subCategoryIds?.length) {
      query.subCategories = {
        $in: subCategoryIds.map((id) => new Types.ObjectId(id)),
      };
    }

    if (excludeCourseId) {
      query._id = { $ne: new Types.ObjectId(excludeCourseId) };
    }

    const exists = await this._courseModel.findOne(query).session(session);

    if (exists) {
      throw new BadRequestException('Course name already exists for the selected category and sub-category');
    }
  }
}
