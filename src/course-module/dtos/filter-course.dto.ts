import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';

import { FilterDto } from 'src/shared/dtos/filter.dto';

export class FilterCourseDto extends FilterDto {
  @IsOptional()
  @IsMongoId({ message: 'categoryId must be a valid MongoDB ObjectId' })
  @ApiProperty({ required: false })
  categoryId?: string;


  @IsOptional()
  @IsMongoId({ message: 'subCategoryId must be a valid MongoDB ObjectId' })
  @ApiProperty({ required: false })
  subCategoryId?: string;
}
