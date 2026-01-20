import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/modules/database.module';
import { CourseModule } from './course-module/course.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule,CourseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
