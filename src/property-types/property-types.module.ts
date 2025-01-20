import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyTypes } from 'db/entities/propertytypes.entity';
import { PropertyTypesController } from './property-types.controller';
import { PropertyTypesService } from './property-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyTypes])],
  controllers: [PropertyTypesController],
  providers: [PropertyTypesService],
})
export class PropertyTypesModule {}
