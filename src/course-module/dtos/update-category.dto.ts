import { ApiProperty } from '@nestjs/swagger';

import {  IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  categoryName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;
}
