import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'JAVA Backend Development',
    description: 'Course title',
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'Learn advanced Java concepts for backend development',
    description: 'Course description',
  })
  description?: string;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  @ApiProperty({
    required: false,
    isArray: true,
    example: ['69710bc0028af7960b96b5a2', '69710f11d4dc9c6898a4fcb5'],
    description: 'List of category IDs that this course belongs to',
  })
  categoryIds?: string[];

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
    @ApiProperty({
    required: false,
    isArray: true,
    example: ['69711740b35b14575f303434', '69711712b35b14575f30342e'],
    description: 'Optional list of sub-category IDs (must belong to selected categories)',
  })
  subCategoryIds?: string[];
}
