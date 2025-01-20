import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Properties } from './Properties.entity';

export enum ListingType {
  BUY = 'bán',
  LEASE = 'cho thuê',
}
@Entity('property_types') // Sử dụng snake_case nhất quán với các bảng khác
export class PropertyTypes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ListingType,
    default: ListingType.BUY,
  })
  listingType: ListingType;

  @OneToMany(() => Properties, (property) => property.property_type_id)
  properties: Properties[];

  @Column({ default: false })
  direction: boolean;

  @Column({ default: false })
  balonDirection: boolean;

  @Column({ default: false })
  floor: boolean;

  @Column({ default: false })
  bedroom: boolean;

  @Column({ default: false })
  bathroom: boolean;

  @Column({ default: false })
  isFurniture: boolean;

  @Column({ default: false })
  Road: boolean;

  @Column({ default: false })
  Legal: boolean;

  @Column({ default: false })
  ResidentialArea: boolean;

  @Column({ default: false })
  Horizontal: boolean;

  @Column({ default: false })
  Length: boolean;

  @Column({ default: false })
  Land_status: boolean;

  @Column({ default: false })
  Deposit_amount: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  setId() {
    this.id = uuidv4();
  }
}
