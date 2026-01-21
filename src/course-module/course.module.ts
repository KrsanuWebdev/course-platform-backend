import { Module } from '@nestjs/common';
import { CategoryController, SubCategoryController } from './controllers';
import { CategoryService, SubCategoryService } from './services';
import { CategorySchema, SubCategorySchema } from 'src/shared/models';
import { DatabaseModule } from 'src/shared/modules/database.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      { name: 'SubCategory', schema: SubCategorySchema },

    ]),
  ],
  controllers: [CategoryController,SubCategoryController],
  providers: [CategoryService,SubCategoryService],
})
export class CourseModule {}
