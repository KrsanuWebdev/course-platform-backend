import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { FilterDto } from 'src/shared/dtos/filter.dto';

export class FilterSubCategoryDto extends FilterDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  categoryId?: string;
}
