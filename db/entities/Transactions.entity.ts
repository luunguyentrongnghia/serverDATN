import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  PrimaryColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { v4 as uuidv4 } from 'uuid';
import { Users } from './users.entity';

export enum transactionType {
  Recharge = 'Nạp tiền',
  BuyPackages = 'Mua gói tin',
  Refund = 'Hoàn tiền',
}
@Entity('Transactions')
export class Transactions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    default: transactionType.BuyPackages,
  })
  transaction_type: transactionType;
  @Column()
  amount: number;
  @Column()
  method: string;
  @Column()
  balance: number;
  @ManyToOne(() => Users, (user) => user.transactions)
  idUser: Users;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  setId() {
    this.id = uuidv4();
  }
}
