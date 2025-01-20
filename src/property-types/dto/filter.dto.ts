import { IsNumberString, IsOptional, IsString, IsIn } from 'class-validator';
import { ListingType } from 'db/entities/propertytypes.entity';

export class FilterPropertyTypeDto {
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
  listingType?: ListingType;
  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'sortDirection must be either "ASC" or "DESC"',
  })
  sortDirection?: 'ASC' | 'DESC';
}
