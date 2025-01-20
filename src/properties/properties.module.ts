import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Properties } from 'db/entities/Properties.entity';
import { PropertyImages } from 'db/entities/propertyimages.entity';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { PackageType } from 'db/entities/PackageType.entity';
import { EmailService } from 'src/email/email.service';
import { Users } from 'db/entities/users.entity';
import { Transactions } from 'db/entities/Transactions.entity';
import { PropertyTypes } from 'db/entities/propertytypes.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Properties,
      PropertyImages,
      PackageType,
      Users,
      Transactions,
      PropertyTypes,
    ]),
    CloudinaryModule,
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService, EmailService],
})
export class PropertiesModule {}
