import { Exclude, Transform } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { District } from './District.entity';
import { Inquiries } from './Inquiries.entity';
import { PackageType } from './PackageType.entity';
import { PropertyImages } from './propertyimages.entity';
import { PropertyTypes } from './propertytypes.entity';
import { Province } from './Province.entity';
import { ReportProperty } from './ReportProperty.entity';
import { Users } from './users.entity';
import { Ward } from './Ward.entity';

export enum Directions {
  DONG_BAC = 'Đông - Bắc',
  TAY_NAM = 'Tây - Nam',
  DONG_NAM = 'Đông - Nam',
  TAY_BAC = 'Tây - Bắc',
  DONG = 'Đông',
  TAY = 'Tây',
  NAM = 'Nam',
  BAC = 'Bắc',
}

export enum PropertieStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DRAFT = 'draft',
  EXPIRED = 'expired',
}
export enum Furniture {
  CAOCAP = 'Cao cấp',
  COBAN = 'Cơ bản',
  FULL = 'Full nội thất',
  THO = 'Bàn giao thô',
  NHATRONG = 'Nhà trống',
}
export enum Legals {
  SAN = 'Sổ hồng sẳn',
  CHO = 'Đang chờ sổ',
  GIAYTAY = 'Mua bán giấy tay',
  HOPDONG = 'Hợp đồng mua bán',
}
export enum Roads {
  NHUA = 'Nhựa',
  BETONG = 'Bê tông',
  DAT = 'Đất',
}
export enum LandStatus {
  SANNHA = 'Đất có sẳn nhà',
  DATTRONG = 'Đất trống',
  CAYTRAI = 'Đất có cấy ăn trái',
  CAYCONGNGHIEP = 'Đất có cây công nghiệp',
  TRONGHOA = 'Đất trông hoa',
}
export enum DepositAmount {
  ONEMONTH = '1 tháng',
  TWOMONTH = '2 tháng',
  THREEMONTH = '3 tháng',
  KOCOC = 'không cọc',
  THOATHUAN = 'Thỏa thuận',
}
@Entity('Properties')
export class Properties {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  address: string;

  @ManyToOne(() => Province, { eager: true })
  province: Province;
  @ManyToOne(() => District, { eager: true })
  district: District;
  @ManyToOne(() => Ward, { eager: true })
  ward: Ward;

  @Column({ type: 'bigint' })
  price: number; // Dùng number thay vì string cho số tiền

  @Column()
  square_meter: number;

  @Column({ default: null })
  description: string;

  @Column({ default: 0 })
  floor: number;

  @Column({ default: 0 })
  bedroom: number;

  @Column({ default: 0 })
  bathroom: number;

  @Column({
    nullable: true,
    default: null,
  })
  isFurniture: string;

  @Column({
    nullable: true,
    default: null,
  })
  direction: string;

  @Column({
    nullable: true,
    default: null,
  })
  balonDirection: string;

  @Column({
    nullable: true,
    default: null,
  })
  Road: string;

  @Column({
    default: null,
    nullable: true,
  })
  Legal: string;

  @Column({ default: 0 })
  ResidentialArea: number;

  @Column({ default: 0 })
  Horizontal: number;

  @Column({ default: 0 })
  Length: number;

  @Column({
    default: null,
    nullable: true,
  })
  Land_status: string;

  @Column({
    default: null,
    nullable: true,
  })
  Deposit_amount: string;

  @Column({ nullable: true })
  totalCost: number;

  @Column({
    type: 'enum',
    enum: PropertieStatus,
    default: PropertieStatus.DRAFT,
  })
  status: PropertieStatus;
  @Column({ nullable: true })
  displayDays: number;
  @Column({ type: 'timestamp', nullable: true })
  start_date: Date;
  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;
  @ManyToOne(() => PropertyTypes, (propertyType) => propertyType.properties)
  property_type_id: PropertyTypes;
  @ManyToOne(() => Users, (user) => user.properties)
  idUser: Users;
  @OneToMany(() => ReportProperty, (report) => report.post)
  reportProperty: ReportProperty[];
  @ManyToOne(() => PackageType, (packageType) => packageType.properties, {
    nullable: true,
  })
  package_type: PackageType;
  @OneToMany(
    () => PropertyImages,
    (propertyImage) => {
      propertyImage.property;
    },
    { cascade: true },
  )
  property_images: PropertyImages[];
  @OneToMany(
    () => Inquiries,
    (Inquirie) => {
      Inquirie.propertyId;
    },
    { cascade: true },
  )
  inquiries: Inquiries[];
  @Column({ type: 'timestamp', nullable: true })
  postedAt: Date;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  setId() {
    this.id = uuidv4();
  }
}
