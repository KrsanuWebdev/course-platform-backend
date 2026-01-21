import { ApiProperty } from '@nestjs/swagger';

import {  IsOptional, IsString } from 'class-validator';

export class UpdateSubCategoryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  subCategoryName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  categoryId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;
}
