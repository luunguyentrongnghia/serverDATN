import { Exclude, Transform } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Properties } from './Properties.entity';

@Entity('Property_images')
export class PropertyImages {
  @PrimaryColumn()
  id: string;
  @Column()
  propertyId: string;
  @ManyToOne(() => Properties, (property) => property.property_images, {
    onDelete: 'CASCADE', // Xóa ảnh khi xóa property nếu cần
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyId', referencedColumnName: 'id' })
  property: Properties;
  @Column()
  image_url: string;
  @Column({ default: false })
  is_main: boolean;
  @Column({ nullable: true })
  caption: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
