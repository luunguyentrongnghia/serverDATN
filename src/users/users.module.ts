import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'db/entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { Province } from 'db/entities/Province.entity';
import { District } from 'db/entities/District.entity';
import { Ward } from 'db/entities/Ward.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Province, District, Ward]),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_JWT,
    }),
    CloudinaryModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, EmailService],
})
export class UsersModule {}
