import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactions, transactionType } from 'db/entities/Transactions.entity';
import { Users } from 'db/entities/users.entity';
import { Between, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { FilterTransactionDto } from './dto/filter.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionRepository: Repository<Transactions>,
  ) {}
  async getTransactions(query: FilterTransactionDto, idUser: string) {
    try {
      const itemPerPage = Number(query.items_per_page) || 10;
      const page = Number(query.page) || 1;
      const skip = (page - 1) * itemPerPage;
      const sortDate = query.sortDate?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      const where: any = {
        idUser: {
          id: idUser,
        },
      };
      if (query.transaction_type) {
        where.transaction_type = query.transaction_type;
      }
      if (query.DaysAgo) {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - Number(query.DaysAgo));
        where.createdAt = MoreThanOrEqual(pastDate);
      } else if (query.startDate && query.endDate) {
        const startDate = query.startDate + ' 00:00:00';
        const endDate = query.endDate + ' 00:00:00';
        console.log(endDate);
        where.createdAt = Between(startDate, endDate);
      }

      const [res, total] = await this.transactionRepository.findAndCount({
        where,
        take: itemPerPage,
        skip: skip,
        order: { createdAt: sortDate },
        relations: {
          idUser: true,
        },
      });
      const lastPage = Math.ceil(total / itemPerPage);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 < 1 ? null : page - 1;
      return {
        success: true,
        data: res,
        total,
        currentPage: page,
        nextPage,
        prevPage,
        lastPage,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve transaction.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getTransactionsExcel(query: FilterTransactionDto, idUser: string) {
    try {
      const sortDate = query.sortDate?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      const where: any = {
        idUser: {
          id: idUser,
        },
      };
      if (query.transaction_type) {
        where.transaction_type = query.transaction_type;
      }
      if (query.DaysAgo) {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - Number(query.DaysAgo));
        where.createdAt = MoreThanOrEqual(pastDate);
      } else if (query.startDate && query.endDate) {
        const startDate = query.startDate + ' 00:00:00';
        const endDate = query.endDate + ' 00:00:00';
        console.log(endDate);
        where.createdAt = Between(startDate, endDate);
      }

      const [res, total] = await this.transactionRepository.findAndCount({
        where,
        order: { createdAt: sortDate },
        relations: {
          idUser: true,
        },
      });

      return {
        success: true,
        data: res,
        total,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve transaction.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getRevenueByMonth(year: number) {
    const queryBuilder =
      this.transactionRepository.createQueryBuilder('Transactions');
    queryBuilder
      .select('EXTRACT(MONTH FROM Transactions.createdAt)', 'month')
      .addSelect('SUM(Transactions.amount)', 'revenue')
      .where('EXTRACT(YEAR FROM Transactions.createdAt) = :year', { year })
      .andWhere('Transactions.transaction_type = :transactionType', {
        transactionType: 'Nạp tiền',
      })
      .groupBy('EXTRACT(MONTH FROM Transactions.createdAt)')
      .orderBy('month', 'ASC');
    const result = await queryBuilder.getRawMany();
    console.log(result);
    const groupedData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      revenue: 0,
    }));
    result.forEach((data) => {
      console.log(data.revenue);
      const month = Number(data.month) - 1;
      groupedData[month].revenue = Number(data.revenue);
    });
    return groupedData.map((data) => ({
      month: new Date(0, data.month - 1).toLocaleString('en-US', {
        month: 'long',
      }),
      revenue: data.revenue,
    }));
  }
}
