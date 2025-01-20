import { Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { ProvinceController } from './province.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Province } from 'db/entities/Province.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Province])],
  providers: [ProvinceService],
  controllers: [ProvinceController],
})
export class ProvinceModule {}
