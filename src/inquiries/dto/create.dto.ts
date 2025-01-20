import {
  IsNumberString,
  IsOptional,
  IsString,
  IsIn,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { Properties } from 'db/entities/Properties.entity';
import { Users } from 'db/entities/users.entity';
import { DeepPartial } from 'typeorm';

export class CreateInquiriesDto {
  @IsNotEmpty()
  message: string;
  @IsNotEmpty()
  url: string;
  @IsNotEmpty()
  infor: string;
  @IsUUID()
  @IsNotEmpty()
  propertyId: DeepPartial<Properties>;
  @IsUUID()
  @IsNotEmpty()
  sellerUser: DeepPartial<Users>;
}
