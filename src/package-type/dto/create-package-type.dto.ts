import {
  IsNumberString,
  IsOptional,
  IsString,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

export class CreatePackageTypeDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  priority_level: number;
  @IsNotEmpty()
  price: number;
  @IsNotEmpty()
  color: string;
  @IsOptional()
  isShowDecription: boolean;
  @IsOptional()
  isShowDetails: boolean;
  @IsOptional()
  isShowContactInfo: boolean;
  @IsOptional()
  isShowOwnerName: boolean;
  @IsOptional()
  Show_startDate: boolean;
}
