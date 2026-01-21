import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { responseSortOrder } from '../enums/common-enum';
import { CATEGORY_SORTABLE_FIELDS } from '../constants/category-sortable-fields';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({ example: 1 })
  pageNumber?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({ example: 10 })
  limit?: number;

  @IsOptional()
  @IsEnum(CATEGORY_SORTABLE_FIELDS)
  @ApiPropertyOptional({ enum: CATEGORY_SORTABLE_FIELDS, required: false,  })
  sortBy?: CATEGORY_SORTABLE_FIELDS;

  @IsOptional()
  @IsEnum(responseSortOrder)
  @ApiPropertyOptional({ enum: responseSortOrder })
  sortOrder?: responseSortOrder;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  pagination?: boolean;
}
