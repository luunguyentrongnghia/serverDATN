import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportProperty } from 'db/entities/ReportProperty.entity';
import { EmailService } from 'src/email/email.service';
import { ReportPropertyController } from './report-property.controller';
import { ReportPropertyService } from './report-property.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReportProperty])],
  controllers: [ReportPropertyController],
  providers: [ReportPropertyService, EmailService],
})
export class ReportPropertyModule {}
