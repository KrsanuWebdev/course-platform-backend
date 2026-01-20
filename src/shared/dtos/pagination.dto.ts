import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class PaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  PageNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  Limit: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return value.toLowerCase() === "true";
    }
    return Boolean(value);
  })
  Pagination?: boolean;
}
