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
import { Properties } from './Properties.entity';
import { Province } from './Province.entity';
import { ReportProperty } from './ReportProperty.entity';
import { Transactions } from './Transactions.entity';
import { Ward } from './Ward.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
export enum UserStatus {
  Lock = 'lock',
  Open = 'open',
}
@Entity('Users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  email: string;
  @Column()
  fullname: string;
  @Column({ default: false })
  emailVerified: boolean;
  @Column()
  @Exclude() //@Exclude() để không trả thuộc tính này khi dử liệu được trả về
  password: string;
  @Column({ nullable: true })
  avatar: string;
  @Column({ nullable: true })
  avatar_id: string;
  @Column({
    type: 'varchar',
    default: UserRole.USER,
  })
  role: UserRole;
  @Column({ nullable: true })
  otp: string;
  @Column({ nullable: true })
  @Exclude()
  resetPwdOtp: string;
  @Column({ type: 'bigint', default: 0 })
  balance: number;
  @Column({ nullable: true })
  googleId: string;
  @Column({ nullable: true })
  isActive: boolean;
  @Column({ nullable: true })
  address: string;
  @Column({
    type: 'varchar',
    default: UserStatus.Open,
  })
  status: UserStatus;
  @ManyToOne(() => Province, { eager: true })
  province: Province;
  @ManyToOne(() => District, { eager: true })
  district: District;
  @ManyToOne(() => Ward, { eager: true })
  ward: Ward;
  @OneToMany(() => Properties, (propertie) => propertie.idUser)
  properties: Properties[];
  @OneToMany(() => Inquiries, (inquiry) => inquiry.contactUser)
  sentInquiries: Inquiries[];

  @OneToMany(() => Inquiries, (inquiry) => inquiry.sellerUser)
  receivedInquiries: Inquiries[];
  @OneToMany(() => Transactions, (transaction) => transaction.idUser)
  transactions: Transactions[];
  @OneToMany(() => ReportProperty, (report) => report.user)
  reportProperty: ReportProperty[];
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @BeforeInsert() //cho phép bạn định nghĩa một phương thức sẽ được gọi tự động trước khi một thực thể (entity) được chèn vào cơ sở dữ liệu.
  setId() {
    this.id = uuidv4();
  }
}
