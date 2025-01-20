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
import { PackageType } from 'db/entities/PackageType.entity';
import { DeepPartial } from 'typeorm';

export class AddPropertiesDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  displayDays: number;

  @IsNotEmpty()
  package_type: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  totalCost: number;
}
