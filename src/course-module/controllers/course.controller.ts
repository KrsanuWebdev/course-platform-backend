import { Controller, Get, Post, Body, Query, Param, Put, Delete } from '@nestjs/common';
import { CourseService } from '../services';
import { CreateCourseDto, UpdateCourseDto } from '../dtos';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { FilterDto } from 'src/shared/dtos/filter.dto';

@ApiTags('Course Module')
@Controller('/')
export class CourseController {
  constructor(private readonly _courseService: CourseService) {}

  @ApiOperation({
    summary: 'Create a new course',
  })
  @Post('course')
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return await this._courseService.createCourse(createCourseDto);
  }

  @ApiOperation({
    summary: 'Get all courses',
  })
  @Get('courses')
  findAllCourses(@Query() query: PaginationDto, @Query() filter: FilterDto) {
    return this._courseService.findAllCourses(query, filter);
  }

  @ApiOperation({
    summary: 'Get a course by ID',
  })
  @Get('course/:courseId')
  findOneCourseById(@Param('courseId') courseId: string) {
    return this._courseService.findOneCourseById(courseId);
  }

  @ApiOperation({
    summary: 'Update a course by ID',
  })
  @Put('course/:courseId')
  updateCourseById(@Param('courseId') courseId: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this._courseService.updateCourseById(courseId, updateCourseDto);
  }

  @ApiOperation({
    summary: 'Delete a course by ID',
  })
  @Delete('course/:courseId')
  deleteCourseById(@Param('courseId') courseId: string) {
    return this._courseService.deleteCourseById(courseId);
  }
}
