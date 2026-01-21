import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { CATEGORY_SORTABLE_FIELDS } from '../constants/category-sortable-fields';
import { responseSortOrder } from '../enums/common-enum';

export class PaginationDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: '1' })
  pageNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: '10' })
  limit?: string;

  @IsOptional()
  @IsEnum(CATEGORY_SORTABLE_FIELDS)
  @ApiProperty({
    enum: CATEGORY_SORTABLE_FIELDS,
    required: false,
    description: 'Field to sort by',
    example: CATEGORY_SORTABLE_FIELDS.CREATED_AT,
  })
  sortBy?: CATEGORY_SORTABLE_FIELDS;

  @IsOptional()
  @IsEnum(responseSortOrder)
  @ApiProperty({
    enum: responseSortOrder,
    default: responseSortOrder.DESC,
    required: false,
    description: 'Sort order (ASC or DESC)',
  })
  sortOrder?: responseSortOrder;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @ApiProperty({
    required: false,
    description: 'Enable pagination',
    example: true,
  })
  pagination?: boolean;
}
