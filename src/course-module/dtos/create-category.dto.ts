import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  categoryName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  description: string;
}
