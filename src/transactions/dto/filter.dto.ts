import { IsNumberString, IsOptional, IsString, IsIn } from 'class-validator';
import { ListingType } from 'db/entities/propertytypes.entity';
import { Province } from 'db/entities/Province.entity';
import { transactionType } from 'db/entities/Transactions.entity';
import { DeepPartial } from 'typeorm';

export class FilterTransactionDto {
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
  transaction_type: transactionType;
  @IsOptional()
  endDate: Date;
  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'sortDirection must be either "ASC" or "DESC"',
  })
  sortDate?: 'ASC' | 'DESC';
}
