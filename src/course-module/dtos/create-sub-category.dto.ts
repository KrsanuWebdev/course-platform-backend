import { ApiProperty } from '@nestjs/swagger';

import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  subCategoryName: string;

  @IsMongoId({ message: 'categoryId must be a valid MongoDB ObjectId' })
  @IsNotEmpty()
  @ApiProperty({ required: true })
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  description: string;
}
