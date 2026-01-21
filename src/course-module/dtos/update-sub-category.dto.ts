import { ApiProperty } from '@nestjs/swagger';

import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateSubCategoryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  subCategoryName?: string;

  @IsMongoId({ message: 'categoryId must be a valid MongoDB ObjectId' })
  @IsOptional()
  @ApiProperty({ required: false })
  categoryId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;
}
