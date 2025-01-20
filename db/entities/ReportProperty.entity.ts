import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Properties } from './Properties.entity';
import { Users } from './users.entity';

export enum ReportStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
}
export enum Reportassess {
  VIOLATION = 'vi phạm',
  NOTVIOLATION = 'không vi phạm',
}
@Entity()
export class ReportProperty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users, (user) => user.reportProperty, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: Users;

  @ManyToOne(() => Properties, (property) => property.reportProperty, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  post: Properties;
  @Column()
  url: string;
  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;
  @Column({
    nullable: true,
    default: null,
  })
  assess: string;
  @Column()
  reason: string;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
