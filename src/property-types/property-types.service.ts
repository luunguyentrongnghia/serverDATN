import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyTypes } from 'db/entities/propertytypes.entity';
import { DeleteResult, In, Like, Repository, UpdateResult } from 'typeorm';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { FilterPropertyTypeDto } from './dto/filter.dto';
import { UpdatePropertyTypeDto } from './dto/update-property-type.dto';

@Injectable()
export class PropertyTypesService {
  constructor(
    @InjectRepository(PropertyTypes)
    private propertyTypeRepository: Repository<PropertyTypes>,
  ) {}
  async findAll(query: FilterPropertyTypeDto): Promise<any> {
    try {
      const itemPerPage = Number(query.items_per_page) || 10;
      const page = Number(query.page) || 1;
      const skip = (page - 1) * itemPerPage;
      const sortDirection =
        query.sortDirection?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      const searchKeyword = query.search ? `%${query.search}%` : '%';
      const [res, total] = await this.propertyTypeRepository.findAndCount({
        where: [{ name: Like(searchKeyword), listingType: query.listingType }],
        order: { name: sortDirection },
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
          message: 'Failed to retrieve property types.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll(): Promise<any> {
    try {
      const data = await this.propertyTypeRepository.find();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Failed to fetch property types:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch property types',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findDetail(id: string): Promise<any> {
    try {
      const data = await this.propertyTypeRepository.findOne({
        where: { id },
      });
      if (!data) {
        return {
          success: false,
          msg: 'không tìm thấy',
        };
      }
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Failed to fetch property types:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch property types',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async create(createPropertyTypeDto: CreatePropertyTypeDto): Promise<any> {
    const checkPropertyType = await this.propertyTypeRepository.findOne({
      where: { name: createPropertyTypeDto.name },
    });
    if (checkPropertyType) {
      return {
        success: false,
        msg: 'đã tồn tại loại tin đăng này',
      };
    }
    try {
      const res = await this.propertyTypeRepository.create({
        ...createPropertyTypeDto,
      });
      const data = await this.propertyTypeRepository.save(res);
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
  async update(
    id: string,
    updatePropertyTypeDto: UpdatePropertyTypeDto,
  ): Promise<UpdateResult> {
    try {
      const updateResult = await this.propertyTypeRepository.update(
        id,
        updatePropertyTypeDto,
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
    return await this.propertyTypeRepository.delete({ id: In(ids) });
  }
}
