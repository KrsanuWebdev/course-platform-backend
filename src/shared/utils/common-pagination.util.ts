import { PaginationDto } from '../dtos/pagination.dto';

export interface PaginationResult {
  limit: number;
  skip: number;
}

export function commanPaginationLogic(
  paginationDto: PaginationDto,
  defaultLimit = 10,
  maxLimitWhenDisabled = 100,
): PaginationResult {
  const paginationEnabled = paginationDto.pagination !== false;

  const page =
    Number(paginationDto.pageNumber) > 0 ? Number(paginationDto.pageNumber) : 1;

  const limit =
    Number(paginationDto.limit) > 0
      ? Number(paginationDto.limit)
      : defaultLimit;

  return {
    limit: paginationEnabled ? limit : maxLimitWhenDisabled,
    skip: paginationEnabled ? (page - 1) * limit : 0,
  };
}
