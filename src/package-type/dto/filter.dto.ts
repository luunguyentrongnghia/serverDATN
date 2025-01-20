import { IsNumberString, IsOptional, IsString, IsIn } from 'class-validator';

export class FilterPackageTypeDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  items_per_page?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
