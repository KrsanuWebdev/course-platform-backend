import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: 'backend' })
  search?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @ApiProperty({ required: false, example: true })
  isActive?: boolean;

  //   @IsOptional()
  //   @Transform(({ value }) => value === 'true')
  //   @IsBoolean()
  //   @ApiProperty({ example: true })
  //   isDeleted?: boolean;
}
