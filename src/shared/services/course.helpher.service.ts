import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, SubCategory, Course} from '../models';

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

  public async validateCategories(categoryIds: string[]) {
    const uniqueIds = Array.from(new Set(categoryIds));
    const objectIds = uniqueIds.map((id) => new Types.ObjectId(id));
    const categories = await this._categoryModel.find({ _id: { $in: objectIds }, isActive: true, isDeleted: false });
    if (categories.length !== uniqueIds.length) {
      throw new BadRequestException('One or more categories are invalid or inactive');
    }
    return categories;
  }

  public async validateSubCategories(subCategoryIds: string[], allowedCategoryIds: string[]) {
    if (!subCategoryIds || subCategoryIds.length === 0) return [];
    const uniqueSubIds = Array.from(new Set(subCategoryIds));
    const objectIds = uniqueSubIds.map((id) => new Types.ObjectId(id));
    const subCategories = await this._subCategoryModel.find({ _id: { $in: objectIds }, isActive: true, isDeleted: false });
    if (subCategories.length !== uniqueSubIds.length) {
      throw new BadRequestException('One or more sub-categories are invalid or inactive');
    }
    const allowedSet = new Set(allowedCategoryIds.map((id) => id.toString()));
    for (const sc of subCategories) {
      const scCat = sc.categoryId ? sc.categoryId.toString() : null;
      if (!scCat || !allowedSet.has(scCat)) {
        throw new BadRequestException('All selected sub-categories must belong to the selected categories');
      }
    }
    return subCategories;
  }

  public async validateCourseNameUniqueness(courseName: string, categoryIds: string[], subCategoryIds: string[], excludeCourseId?: string) {
    const query: any = {
      courseName: courseName.trim(),
      isDeleted: false,
    };

    if (excludeCourseId) {
      query._id = { $ne: new Types.ObjectId(excludeCourseId) };
    }

    if (categoryIds.length > 0) {
      query.categories = { $in: categoryIds.map((id) => new Types.ObjectId(id)) };
    }

    if (subCategoryIds.length > 0) {
      query.subCategories = { $in: subCategoryIds.map((id) => new Types.ObjectId(id)) };
    }

    const existing = await this._courseModel.exists(query);

    if (existing) {
      throw new BadRequestException('Course with the same name already exists for the selected category and sub-category');
    }
  }
}
