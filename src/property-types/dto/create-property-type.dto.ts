import {
  IsNumberString,
  IsOptional,
  IsString,
  IsIn,
  IsNotEmpty,
} from 'class-validator';
import { ListingType } from 'db/entities/propertytypes.entity';

export class CreatePropertyTypeDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  listingType: ListingType;
  @IsOptional()
  direction: boolean;
  @IsOptional()
  balonDirection: boolean;
  @IsOptional()
  floor: boolean;
  @IsOptional()
  bedroom: boolean;
  @IsOptional()
  bathroom: boolean;
  @IsOptional()
  isFurniture: boolean;
  @IsOptional()
  Road: boolean;
  @IsOptional()
  Legal: boolean;
  @IsOptional()
  ResidentialArea: boolean;
  @IsOptional()
  Horizontal: boolean;
  @IsOptional()
  Length: boolean;
  @IsOptional()
  Land_status: boolean;
  @IsOptional()
  Deposit_amount: boolean;
}
