import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inquiries, InquiriesStatus } from 'db/entities/Inquiries.entity';
import { Users } from 'db/entities/users.entity';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateInquiriesDto } from './dto/create.dto';
import { FilterInquiriesDto } from './dto/filter.dto';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiries)
    private readonly inquiriesRepository: Repository<Inquiries>,
  ) {}
  async createInquiries(createInquiriesDto: CreateInquiriesDto, user: Users) {
    try {
      console.log(createInquiriesDto);
      const res = await this.inquiriesRepository.create({
        ...createInquiriesDto,
        contactUser: user,
      });
      const data = await this.inquiriesRepository.save(res);
      if (data) {
        return {
          success: true,
          msg: 'Thành công vui lòng chờ phản hồi',
        };
      }
      return {
        success: false,
        msg: 'Thất bại',
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
  async getInquiries(query: FilterInquiriesDto, idUser: string) {
    try {
      const itemPerPage = Number(query.items_per_page) || 10;
      const page = Number(query.page) || 1;
      const skip = (page - 1) * itemPerPage;
      const searchKeyword = query.search ? `%${query.search}%` : '%';
      const sortDate = query.sortDate?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      const where: any = {
        sellerUser: {
          id: idUser,
        },
      };
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

      const [res, total] = await this.inquiriesRepository.findAndCount({
        where,
        take: itemPerPage,
        skip: skip,
        order: { createdAt: sortDate },
        relations: {
          contactUser: true,
          sellerUser: true,
          propertyId: true,
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
  async UpdateStatus(id: string, status: InquiriesStatus) {
    try {
      const check = await this.inquiriesRepository.findOne({
        where: {
          id,
        },
      });
      if (check) {
        const update = await this.inquiriesRepository.save({
          ...check,
          status,
        });
        if (update) {
          return {
            success: true,
            msg: 'Thành công',
          };
        }
      }
      return {
        success: false,
        msg: 'Thất bại',
      };
    } catch (error) {
      console.log(error);
    }
  }
}
