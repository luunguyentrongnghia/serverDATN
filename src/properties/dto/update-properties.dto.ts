import { Exclude, Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDate,
  IsBoolean,
} from 'class-validator';

import { IsUUID } from 'class-validator'; // Đảm bảo ID đúng định dạng UUID
import { District } from 'db/entities/District.entity';
import { PackageType } from 'db/entities/PackageType.entity';
import {
  DepositAmount,
  Directions,
  Furniture,
  LandStatus,
  Legals,
  PropertieStatus,
  Roads,
} from 'db/entities/Properties.entity';
import { PropertyTypes } from 'db/entities/propertytypes.entity';
import { Province } from 'db/entities/Province.entity';
import { Users } from 'db/entities/users.entity';
import { Ward } from 'db/entities/Ward.entity';
import { DeepPartial } from 'typeorm';

export class UpdatePropertiesDto {
  @IsOptional()
  title?: string;
  @IsOptional()
  address?: string;
  @IsOptional()
  province?: DeepPartial<Province>;
  @IsOptional()
  district?: DeepPartial<District>;
  @IsOptional()
  ward?: DeepPartial<Ward>;

  @IsNumber()
  @Type(() => Number)
  price?: number;

  @IsNumber()
  @Type(() => Number)
  square_meter?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  avgStar?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  floor?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  bedroom?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  bathroom?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  Horizontal?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  Length?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  ResidentialArea?: number;

  @IsEnum(Furniture)
  @IsOptional()
  isFurniture?: Furniture;

  @IsOptional()
  direction?: string;

  @IsOptional()
  balonDirection?: string;

  @IsOptional()
  Legal?: string;

  @IsOptional()
  Road?: string;

  @IsOptional()
  Land_status?: string;

  @IsOptional()
  Deposit_amount?: string;

  @IsString()
  @IsOptional()
  video_url?: string;

  @IsString()
  @IsOptional()
  video_id?: string;
}
