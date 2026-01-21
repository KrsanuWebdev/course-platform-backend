import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

import { FilterDto } from 'src/shared/dtos/filter.dto';

export class FilterSubCategoryDto extends FilterDto {
  @IsOptional()
  @IsString()
  @IsMongoId({ message: 'categoryId must be a valid MongoDB ObjectId' })
  @ApiProperty({ required: false })
  categoryId?: string;
}
