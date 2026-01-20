import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dtos';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/shared/models';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    
    const category = await this.categoryModel.create(createCategoryDto);
    const response = {
      message: 'Category created successfully',
      data: category,
    };
    return response;
  }
}
