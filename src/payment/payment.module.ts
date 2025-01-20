import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from 'db/entities/Transactions.entity';
import { Users } from 'db/entities/users.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Transactions])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
