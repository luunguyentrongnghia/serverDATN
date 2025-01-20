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

export class CreateReportPropertyDto {
  @IsNotEmpty()
  url: string;
  @IsNotEmpty()
  reason: string;
  @IsUUID()
  @IsNotEmpty()
  post: DeepPartial<Properties>;
}
