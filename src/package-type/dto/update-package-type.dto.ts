import {
  IsNumberString,
  IsOptional,
  IsString,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

export class UpdatePackageTypeDto {
  name: string;
  priority_level: number;
  price: number;
  color: string;
  isShowDecription: boolean;
  isShowDetails: boolean;
  isShowContactInfo: boolean;
  isShowOwnerName: boolean;
  Show_startDate: boolean;
}
