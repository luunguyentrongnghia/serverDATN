import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageType } from 'db/entities/PackageType.entity';
import { PackageTypeController } from './package-type.controller';
import { PackageTypeService } from './package-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([PackageType])],
  controllers: [PackageTypeController],
  providers: [PackageTypeService],
})
export class PackageTypeModule {}
