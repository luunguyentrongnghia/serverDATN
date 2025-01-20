import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { v4 as uuidv4 } from 'uuid';
import { Properties } from './Properties.entity';
export enum InquiriesStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
}
@Entity()
export class Inquiries {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message: string;
  @Column()
  infor: string;
  @ManyToOne(() => Users, (user) => user.receivedInquiries, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sellerUser: Users;
  @ManyToOne(() => Users, (user) => user.sentInquiries, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  contactUser: Users;
  @Column()
  url: string;
  @Column({
    type: 'enum',
    enum: InquiriesStatus,
    default: InquiriesStatus.PENDING,
  })
  status: InquiriesStatus;
  @ManyToOne(() => Properties, (property) => property.inquiries, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  propertyId: Properties;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  @BeforeInsert()
  setId() {
    this.id = uuidv4();
  }
}
