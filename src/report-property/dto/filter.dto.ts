import { IsNumberString, IsOptional, IsString, IsIn } from 'class-validator';

export class FilterReportPropertyDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  items_per_page?: string;

  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  DaysAgo: number;
  @IsOptional()
  startDate: Date;
  @IsOptional()
  endDate: Date;
  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'sortDirection must be either "ASC" or "DESC"',
  })
  sortDate?: 'ASC' | 'DESC';
}
