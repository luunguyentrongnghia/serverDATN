import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageType } from 'db/entities/PackageType.entity';
import { DeleteResult, In, Like, Repository, UpdateResult } from 'typeorm';
import { CreatePackageTypeDto } from './dto/create-package-type.dto';
import { FilterPackageTypeDto } from './dto/filter.dto';
import { UpdatePackageTypeDto } from './dto/update-package-type.dto';

@Injectable()
export class PackageTypeService {
  constructor(
    @InjectRepository(PackageType)
    private packageTypeRepository: Repository<PackageType>,
  ) {}
  async create(createPackageTypeDto: CreatePackageTypeDto): Promise<any> {
    const checkPackageType = await this.packageTypeRepository.findOne({
      where: [
        { name: createPackageTypeDto.name },
        { color: createPackageTypeDto.color },
      ],
    });
    if (checkPackageType) {
      return {
        success: false,
        msg: 'đã tồn tại gói tin này',
      };
    }
    try {
      const res = await this.packageTypeRepository.create({
        ...createPackageTypeDto,
      });
      const data = await this.packageTypeRepository.save(res);
      return {
        success: true,
        data,
        msg: 'thêm thành công',
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
  async getAll(): Promise<any> {
    try {
      const data = await this.packageTypeRepository.find();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Failed to fetch package types:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch package types',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findAll(query: FilterPackageTypeDto): Promise<any> {
    try {
      const itemPerPage = Number(query.items_per_page) || 10;
      const page = Number(query.page) || 1;
      const skip = (page - 1) * itemPerPage;

      const searchKeyword = query.search ? `%${query.search}%` : '%';
      const [res, total] = await this.packageTypeRepository.findAndCount({
        where: { name: Like(searchKeyword) },
        take: itemPerPage,
        skip: skip,
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
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve package types.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async update(
    id: string,
    updatePackageTypeDto: UpdatePackageTypeDto,
  ): Promise<UpdateResult> {
    try {
      const updateResult = await this.packageTypeRepository.update(
        id,
        updatePackageTypeDto,
      );

      if (updateResult.affected === 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'property type not found!',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return updateResult;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error('Unexpected error:', error);
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }
  async delete(ids: string[]): Promise<DeleteResult> {
    return await this.packageTypeRepository.delete({ id: In(ids) });
  }
}
