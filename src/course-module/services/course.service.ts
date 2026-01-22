import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCourseDto, FilterCourseDto, UpdateCourseDto } from '../dtos';
import { InjectModel } from '@nestjs/mongoose';
import { Category, SubCategory, Course } from 'src/shared/models';
import { Model, Types } from 'mongoose';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { responseSortOrder } from 'src/shared/enums/common-enum';
import { FilterDto } from 'src/shared/dtos/filter.dto';
import { commanPaginationLogic } from 'src/shared/utils';
import { CourseHelpherService } from 'src/shared/services/course.helpher.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name)
    private readonly _courseModel: Model<Course>,

    private readonly _courseHelpherService: CourseHelpherService,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto) {
    const { courseName, categoryIds, subCategoryIds } = createCourseDto;

    await this._courseHelpherService.validateCategories(categoryIds);

    await this._courseHelpherService.validateSubCategories(subCategoryIds || [], categoryIds);
    await this._courseHelpherService.validateCourseNameUniqueness(courseName, categoryIds, subCategoryIds);

    const course = await this._courseModel.create({
      courseName: createCourseDto.courseName,
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

  async findAllCourses(paginationDto: PaginationDto, filterDto: FilterCourseDto) {
    const { sortBy, sortOrder } = paginationDto;
    const { search, isActive = true, categoryId, subCategoryId } = filterDto;

    const filter: Record<string, any> = {};

    if (typeof isActive === 'boolean') {
      filter.isActive = isActive;
    }

    if (search) {
      filter.courseName = { $regex: search, $options: 'i' };
    }
    if (categoryId) {
      filter.categories = new Types.ObjectId(categoryId);
    }

    if (subCategoryId) {
      filter.subCategories = new Types.ObjectId(subCategoryId);
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
        select: 'subCategoryName',
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
        select: 'subCategoryName',
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
    if (!Types.ObjectId.isValid(courseId)) {
      throw new BadRequestException('Invalid courseId');
    }

    const course = await this._courseModel.findOne({
      _id: new Types.ObjectId(courseId),
      isDeleted: false,
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const finalCategoryIds = updateCourseDto.categoryIds ? updateCourseDto.categoryIds : course.categories.map((id) => id.toString());

    const finalSubCategoryIds = updateCourseDto.subCategoryIds ? updateCourseDto.subCategoryIds : course.subCategories.map((id) => id.toString());

    if (updateCourseDto.categoryIds) {
      await this._courseHelpherService.validateCategories(updateCourseDto.categoryIds);
    }

    if (updateCourseDto.subCategoryIds) {
      await this._courseHelpherService.validateSubCategories(updateCourseDto.subCategoryIds, finalCategoryIds);
    }

    if (updateCourseDto.courseName || updateCourseDto.categoryIds || updateCourseDto.subCategoryIds) {
      await this._courseHelpherService.validateCourseNameUniqueness(updateCourseDto.courseName ?? course.courseName, finalCategoryIds, finalSubCategoryIds, courseId);
    }

    const update: Record<string, any> = {};

    if (updateCourseDto.courseName !== undefined) {
      update.courseName = updateCourseDto.courseName.trim();
    }

    if (updateCourseDto.description !== undefined) {
      update.description = updateCourseDto.description;
    }

    if (updateCourseDto.categoryIds) {
      update.categories = updateCourseDto.categoryIds.map((id) => new Types.ObjectId(id));
    }

    if (updateCourseDto.subCategoryIds) {
      update.subCategories = updateCourseDto.subCategoryIds.map((id) => new Types.ObjectId(id));
    }

    if (Object.keys(update).length === 0) {
      throw new BadRequestException('No valid fields provided for update');
    }

    await this._courseModel.findByIdAndUpdate(
      course._id,
      { $set: update },
      {
        new: true,
        runValidators: true,
      },
    );

    return {
      message: 'Course updated successfully',
    };
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
