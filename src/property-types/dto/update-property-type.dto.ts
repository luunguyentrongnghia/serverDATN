import { ListingType } from 'db/entities/propertytypes.entity';

export class UpdatePropertyTypeDto {
  name?: string;
  listingType?: ListingType;
  direction?: boolean;
  balonDirection?: boolean;
  floor?: boolean;
  bedroom?: boolean;
  bathroom?: boolean;
  isFurniture?: boolean;
  Road?: boolean;
  Legal: boolean;
  ResidentialArea?: boolean;
  Horizontal?: boolean;
  Length?: boolean;
  Land_status?: boolean;
  Deposit_amount?: boolean;
}
