import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginationQueryDto {
  @IsPositive()
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  cursor?: string;
}
