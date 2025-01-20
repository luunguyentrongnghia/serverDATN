import { IsBoolean, IsString } from 'class-validator';

export class UpdateImageMainDto {
  @IsBoolean()
  is_main: boolean;

  @IsString()
  idProperty: string;
}
