import { Properties } from 'db/entities/Properties.entity';
import { DeepPartial } from 'typeorm';

export class UploadImageDto {
  id?: string;
  image_url?: string;
  property: DeepPartial<Properties>;
  is_main?: boolean;
  caption?: string;
}
