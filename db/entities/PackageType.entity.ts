import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  Unique,
} from 'typeorm';
import { Properties } from './Properties.entity';
import { v4 as uuidv4 } from 'uuid';
@Entity('package_types')
@Unique(['priority_level'])
export class PackageType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  isShowDecription: boolean;

  @Column({ default: false })
  isShowDetails: boolean;

  @Column({ default: false })
  isShowContactInfo: boolean;

  @Column({ default: false })
  isShowOwnerName: boolean;

  @Column({ type: 'bigint' })
  price: number;
  @Column({ type: 'int' })
  priority_level: number;
  @Column({ type: 'varchar', length: 7, nullable: true })
  color: string;
  @OneToMany(() => Properties, (property) => property.package_type)
  properties: Properties[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  @BeforeInsert()
  setId() {
    this.id = uuidv4();
  }
}
