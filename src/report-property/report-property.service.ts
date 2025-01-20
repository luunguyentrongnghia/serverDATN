import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Reportassess,
  ReportProperty,
  ReportStatus,
} from 'db/entities/ReportProperty.entity';
import { Users } from 'db/entities/users.entity';
import { EmailService } from 'src/email/email.service';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateReportPropertyDto } from './dto/create.dto';
import { FilterReportPropertyDto } from './dto/filter.dto';

@Injectable()
export class ReportPropertyService {
  constructor(
    @InjectRepository(ReportProperty)
    private reportPropertyRepository: Repository<ReportProperty>,
    private readonly emailService: EmailService,
  ) {}
  async createReportProperty(
    createReportPropertyDto: CreateReportPropertyDto,
    user: Users,
  ) {
    try {
      const res = await this.reportPropertyRepository.create({
        ...createReportPropertyDto,
        user: user,
      });
      const data = await this.reportPropertyRepository.save(res);
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
  async getReportProperty(query: FilterReportPropertyDto) {
    try {
      const itemPerPage = Number(query.items_per_page) || 10;
      const page = Number(query.page) || 1;
      const skip = (page - 1) * itemPerPage;
      const searchKeyword = query.search ? `%${query.search}%` : '%';
      const sortDate = query.sortDate?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      const where: any = {};
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

      const [res, total] = await this.reportPropertyRepository.findAndCount({
        where,
        take: itemPerPage,
        skip: skip,
        order: { createdAt: sortDate },
        relations: {
          user: true,
          post: true,
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
  async UpdateStatus(
    id: string,
    status: ReportStatus,
    assess: Reportassess,
    adminNote: string,
  ) {
    try {
      const check = await this.reportPropertyRepository.findOne({
        where: {
          id,
        },
        relations: {
          user: true,
        },
      });
      if (check) {
        const update = await this.reportPropertyRepository.save({
          ...check,
          status,
        });
        if (update) {
          await this.emailService.sendMail(
            check.user.email,
            'batdongsanvn',
            'report-response',
            {
              tenNguoiDung: check.user.fullname,
              trangThaiBaoCao: assess,
              ghiChuQuanTri: adminNote,
            },
          );
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
  async delete(id: string) {
    try {
      const res = await this.reportPropertyRepository.delete(id);
      if (res) {
        return {
          success: true,
          msg: 'Thành công',
        };
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
