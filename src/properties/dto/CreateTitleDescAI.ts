import { Exclude, Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { District } from 'db/entities/District.entity';
import { Furniture } from 'db/entities/Properties.entity';
import { Province } from 'db/entities/Province.entity';
import { Ward } from 'db/entities/Ward.entity';
import { DeepPartial } from 'typeorm';

export class CreateTitleDescAiDTO {
  @IsNotEmpty()
  province: DeepPartial<Province>;

  @IsNotEmpty()
  district: DeepPartial<District>;

  @IsNotEmpty()
  ward: DeepPartial<Ward>;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  square_meter: number;

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

  @IsOptional()
  PropertyTypeId?: string;
}
