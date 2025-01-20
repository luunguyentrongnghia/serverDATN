import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inquiries } from 'db/entities/Inquiries.entity';
import { InquiriesController } from './inquiries.controller';
import { InquiriesService } from './inquiries.service';

@Module({
  imports: [TypeOrmModule.forFeature([Inquiries])],
  controllers: [InquiriesController],
  providers: [InquiriesService],
})
export class InquiriesModule {}
