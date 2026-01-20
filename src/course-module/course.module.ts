import { Module } from '@nestjs/common';
import { CategoryController } from './controllers';
import { CategoryService } from './services';
import { CategorySchema } from 'src/shared/models';
import { DatabaseModule } from 'src/shared/modules/database.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CourseModule {}
