import { Module } from '@nestjs/common';
import { CategoryController, SubCategoryController, CourseController } from './controllers';
import { CategoryService, SubCategoryService, CourseService } from './services';
import { CategorySchema, SubCategorySchema, CourseSchema } from 'src/shared/models';
import { DatabaseModule } from 'src/shared/modules/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseHelpherService } from 'src/shared/services/course.helpher.service';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      { name: 'SubCategory', schema: SubCategorySchema },
      { name: 'Course', schema: CourseSchema },
    ]),
  ],
  controllers: [CategoryController, SubCategoryController, CourseController],
  providers: [CategoryService, SubCategoryService, CourseService,CourseHelpherService],
})
export class CourseModule {}
