import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSoureOptions } from 'db/data-source';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { PropertyTypesModule } from './property-types/property-types.module';
import { AuthGaurd } from './users/auth.gaurd';
import { APP_GUARD } from '@nestjs/core';
import { Users } from 'db/entities/users.entity';
import { RolesGuard } from './users/role.gaurd';
import { PackageTypeModule } from './package-type/package-type.module';
import { ProvinceModule } from './province/province.module';
import { WardModule } from './ward/ward.module';
import { DistrictModule } from './district/district.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PropertiesModule } from './properties/properties.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Properties } from 'db/entities/Properties.entity';
import { EmailService } from './email/email.service';
import { PaymentModule } from './payment/payment.module';
import { TransactionsModule } from './transactions/transactions.module';
import { Transactions } from 'db/entities/Transactions.entity';
import { StatusGuard } from './users/status.gaurd';
import { InquiriesModule } from './inquiries/inquiries.module';
import { ReportPropertyModule } from './report-property/report-property.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Properties, Users, Transactions]),
    CloudinaryModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSoureOptions),
    TypeOrmModule.forFeature([Users]),
    ScheduleModule.forRoot(),
    UsersModule,
    EmailModule,
    PropertyTypesModule,
    PackageTypeModule,
    ProvinceModule,
    WardModule,
    DistrictModule,
    CloudinaryModule,
    PropertiesModule,
    PaymentModule,
    TransactionsModule,
    InquiriesModule,
    ReportPropertyModule,
  ],
  controllers: [AppController],
  providers: [
    EmailService,
    AppService,
    {
      provide: APP_GUARD, //APP_GUARD để áp dụng một guard cho toàn bộ ứng dụng
      useClass: AuthGaurd,
    },
    {
      provide: APP_GUARD, //APP_GUARD để áp dụng một guard cho toàn bộ ứng dụng
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD, //APP_GUARD để áp dụng một guard cho toàn bộ ứng dụng
      useClass: StatusGuard,
    },
  ],
})
export class AppModule {}
