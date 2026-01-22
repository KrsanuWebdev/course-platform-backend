import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCourseDto, UpdateCourseDto } from '../dtos';
import { InjectModel } from '@nestjs/mongoose';
import { Category, SubCategory, Course } from 'src/shared/models';
import { Model, Types } from 'mongoose';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { responseSortOrder } from 'src/shared/enums/common-enum';
import { FilterDto } from 'src/shared/dtos/filter.dto';
import { commanPaginationLogic } from 'src/shared/utils';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name)
    private readonly _courseModel: Model<Course>,
    @InjectModel(Category.name)
    private readonly _categoryModel: Model<Category>,
    @InjectModel(SubCategory.name)
    private readonly _subCategoryModel: Model<SubCategory>,
  ) {}

  private async validateCategories(categoryIds: string[]) {
    const uniqueIds = Array.from(new Set(categoryIds));
    const objectIds = uniqueIds.map((id) => new Types.ObjectId(id));
    const categories = await this._categoryModel.find({ _id: { $in: objectIds }, isActive: true, isDeleted: false });
    if (categories.length !== uniqueIds.length) {
      throw new BadRequestException('One or more categories are invalid or inactive');
    }
    return categories;
  }

  private async validateSubCategories(subCategoryIds: string[], allowedCategoryIds: string[]) {
    if (!subCategoryIds || subCategoryIds.length === 0) return [];
    const uniqueSubIds = Array.from(new Set(subCategoryIds));
    const objectIds = uniqueSubIds.map((id) => new Types.ObjectId(id));
    const subCategories = await this._subCategoryModel.find({ _id: { $in: objectIds }, isActive: true, isDeleted: false });
    if (subCategories.length !== uniqueSubIds.length) {
      throw new BadRequestException('One or more sub-categories are invalid or inactive');
    }

    // Ensure every sub-category belongs to one of the allowed categories
    const allowedSet = new Set(allowedCategoryIds.map((id) => id.toString()));
    for (const sc of subCategories) {
      const scCat = sc.categoryId ? sc.categoryId.toString() : null;
      if (!scCat || !allowedSet.has(scCat)) {
        throw new BadRequestException('All selected sub-categories must belong to the selected categories');
      }
    }
    return subCategories;
  }

  async createCourse(createCourseDto: CreateCourseDto) {
    const { categoryIds, subCategoryIds } = createCourseDto;

    // Validate categories
    await this.validateCategories(categoryIds);

    // Validate subCategories and ownership
    await this.validateSubCategories(subCategoryIds || [], categoryIds);

    const course = await this._courseModel.create({
      title: createCourseDto.title,
      description: createCourseDto.description,
      categories: categoryIds.map((id) => new Types.ObjectId(id)),
      subCategories: (subCategoryIds || []).map((id) => new Types.ObjectId(id)),
    });

    const response = {
      message: 'Course created successfully',
      data: course,
    };
    return response;
  }

  async findAllCourses(paginationDto: PaginationDto, filterDto: FilterDto) {
    const { sortBy, sortOrder } = paginationDto;
    const { search, isActive = true } = filterDto;

    const filter: Record<string, any> = {};

    if (typeof isActive === 'boolean') {
      filter.isActive = isActive;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const query = this._courseModel
      .find(filter)
      .populate({
        path: 'categories',
        select: 'categoryName',
        match: { isActive: true, isDeleted: false },
      })
      .populate({
        path: 'subCategories',
        select: 'subCategoryName categoryId',
        match: { isActive: true, isDeleted: false },
      });

    if (sortBy) {
      query.sort({
        [sortBy]: sortOrder === responseSortOrder.ASC ? 1 : -1,
      });
    } else {
      query.sort({ createdAt: -1 });
    }

    const { limit, skip } = commanPaginationLogic(paginationDto);

    query.skip(skip).limit(limit);

    const [courses, total] = await Promise.all([query.exec(), this._courseModel.countDocuments(filter)]);

    const response = {
      message: total > 0 ? 'Courses retrieved successfully' : 'No courses found',
      data: { total, courses },
    };
    return response;
  }

  async findOneCourseById(courseId: string) {
    const course = await this._courseModel
      .findOne({
        _id: new Types.ObjectId(courseId),
        isActive: true,
        isDeleted: false,
      })
      .populate({
        path: 'categories',
        select: 'categoryName',
        match: { isActive: true, isDeleted: false },
      })
      .populate({
        path: 'subCategories',
        select: 'subCategoryName categoryId',
        match: { isActive: true, isDeleted: false },
      });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const response = {
      message: 'Course retrieved successfully',
      data: course,
    };
    return response;
  }

  async updateCourseById(courseId: string, updateCourseDto: UpdateCourseDto) {
    if (updateCourseDto.categoryIds) {
      await this.validateCategories(updateCourseDto.categoryIds);
    }

    if (updateCourseDto.subCategoryIds) {
      const course = await this._courseModel.findById(courseId);
      if (!course) throw new NotFoundException('Course not found');
      const allowed = updateCourseDto.categoryIds ? updateCourseDto.categoryIds : course.categories.map((c) => c.toString());
      await this.validateSubCategories(updateCourseDto.subCategoryIds, allowed as string[]);
    }

    const update: any = {};
    if (updateCourseDto.title) update.title = updateCourseDto.title;
    if (updateCourseDto.description) update.description = updateCourseDto.description;
    if (updateCourseDto.categoryIds) update.categories = updateCourseDto.categoryIds.map((id) => new Types.ObjectId(id));
    if (updateCourseDto.subCategoryIds) update.subCategories = updateCourseDto.subCategoryIds.map((id) => new Types.ObjectId(id));

    const course = await this._courseModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(courseId),
        isDeleted: false,
      },
      {
        $set: update,
      },
    );

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const response = {
      message: 'Course updated successfully',
      data: course,
    };
    return response;
  }

  async deleteCourseById(courseId: string) {
    const course = await this._courseModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(courseId),
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

    if (!course) {
      throw new NotFoundException('Course not found or already deleted');
    }

    const response = {
      message: 'Course deleted successfully',
    };
    return response;
  }
}
