import { IsNumberString, IsOptional, IsString, IsIn } from 'class-validator';
import { ListingType } from 'db/entities/propertytypes.entity';
import { Province } from 'db/entities/Province.entity';
import { DeepPartial } from 'typeorm';

export class FilterPropertyDto {
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
  provinceId?: string;
  @IsOptional()
  districtId?: string;
  @IsOptional()
  price?: number;
  @IsOptional()
  @IsNumberString()
  minPrice?: string; // Giá thấp nhất
  @IsOptional()
  @IsNumberString()
  maxPrice?: string; // Giá cao nhất
  @IsOptional()
  @IsNumberString()
  minSquareMeter?: string; // Giá thấp nhất
  @IsOptional()
  @IsNumberString()
  maxSquareMeter?: string;
  @IsOptional()
  PropertyTypeId?: string;
  @IsOptional()
  listingType?: string;
  @IsOptional()
  packageTypeId?: string;
  @IsOptional()
  LevelPackageType?: string;
  @IsOptional()
  status?: string;
  @IsOptional()
  excludeIds?: string;
  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'sortDirection must be either "ASC" or "DESC"',
  })
  sortPrice?: 'ASC' | 'DESC';
  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'sortDirection must be either "ASC" or "DESC"',
  })
  sortSquareMeter?: 'ASC' | 'DESC';
  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'sortDirection must be either "ASC" or "DESC"',
  })
  sortLevel?: 'ASC' | 'DESC';
}
