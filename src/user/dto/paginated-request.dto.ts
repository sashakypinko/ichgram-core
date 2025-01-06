import { IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginatedRequestDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @Min(0, { message: 'Offset can\'t be less then 0' })
  offset?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @Min(1, { message: 'Limit can\'t be less then 1' })
  limit?: number;
}