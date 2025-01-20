import { Module } from '@nestjs/common';
import { WardService } from './ward.service';
import { WardController } from './ward.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ward } from 'db/entities/Ward.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ward])],
  providers: [WardService],
  controllers: [WardController],
})
export class WardModule {}
