import { IsNumberString, IsOptional, IsString, IsIn } from 'class-validator';
import { ListingType } from 'db/entities/propertytypes.entity';
import { Province } from 'db/entities/Province.entity';
import { DeepPartial } from 'typeorm';

export class FilterPropertyUserDto {
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
  provinceId: string;
  @IsOptional()
  price?: number;
  @IsOptional()
  @IsNumberString()
  minPrice?: string; // Giá thấp nhất
  @IsOptional()
  @IsNumberString()
  maxPrice?: string; // Giá cao nhất
  @IsOptional()
  packageTypeId?: string;
  @IsOptional()
  PropertyTypeId?: string;
  @IsOptional()
  status?: string;
  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'sortDirection must be either "ASC" or "DESC"',
  })
  sortDirection?: 'ASC' | 'DESC';
}
