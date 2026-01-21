import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  subCategoryName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  description: string;
}
