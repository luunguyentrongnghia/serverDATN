import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PackageType } from 'db/entities/PackageType.entity';
import { Properties, PropertieStatus } from 'db/entities/Properties.entity';
import { PropertyImages } from 'db/entities/propertyimages.entity';
import { Users } from 'db/entities/users.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { EmailService } from 'src/email/email.service';
import {
  Between,
  DeleteResult,
  In,
  Like,
  Not,
  Repository,
  UpdateResult,
} from 'typeorm';
import { AddPropertiesDto } from './dto/addPost';
import { CreatePropertiesDto } from './dto/create-propertie.dto';
import { FilterPropertyDto } from './dto/filter.dto';
import { FilterPropertyUserDto } from './dto/filterPropertyUser.dto';
import { UpdatePropertiesDto } from './dto/update-properties.dto';
import { UpdateImageMainDto } from './dto/updateImageMain.dto';
import { UploadImageDto } from './dto/uploadImage.dto';
import * as schedule from 'node-schedule';
import { Transactions, transactionType } from 'db/entities/Transactions.entity';
import { CreateTitleDescAiDTO } from './dto/CreateTitleDescAI';
import { PropertyTypes } from 'db/entities/propertytypes.entity';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Properties)
    private propertiesRepository: Repository<Properties>,
    @InjectRepository(PropertyImages)
    private propertyImagesRepository: Repository<PropertyImages>,
    @InjectRepository(PackageType)
    private PackageTypeRepository: Repository<PackageType>,
    @InjectRepository(Users)
    private UsersRepository: Repository<Users>,
    @InjectRepository(PropertyTypes)
    private PropertyTypesRepository: Repository<PropertyTypes>,
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
    private cloudinaryService: CloudinaryService,
    private readonly emailService: EmailService,
  ) {}
  async getAll(): Promise<any> {
    try {
      const data = await this.propertiesRepository.find();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Failed to fetch property types:', error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch properties',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async create(createPropertiesDto: CreatePropertiesDto): Promise<any> {
    try {
      const res = await this.propertiesRepository.create({
        ...createPropertiesDto,
      });
      const data = await this.propertiesRepository.save(res);
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
  async uploadImageProperty(uploadImageDto: UploadImageDto): Promise<any> {
    try {
      const res = await this.propertyImagesRepository.create({
        ...uploadImageDto,
      });
      const data = await this.propertyImagesRepository.save(res);
      if (data) {
        return {
          success: true,
          data,
          msg: 'thêm thành công',
        };
      }
      return {
        success: false,
        msg: 'thêm thất bại',
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
  async getProperty(id: string) {
    try {
      const response = await this.propertiesRepository.findOne({
        where: { id },
        relations: {
          package_type: true,
          province: true,
          idUser: true,
          property_type_id: true,
        },
        select: {
          idUser: {
            id: true,
            email: true,
            fullname: true,
            avatar: true,
            address: true,
          },
        },
      });
      if (!response) {
        return {
          success: false,
          msg: 'không tìm thấy tin đăng',
        };
      }
      const mainImage = await this.propertyImagesRepository.find({
        where: { property: { id } },
        select: {
          id: true,
          image_url: true,
          is_main: true,
          caption: true,
        },
      });
      response['mainImage'] = mainImage;
      return {
        success: true,
        data: response,
        msg: 'Thành công',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve property.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async GetPropertyTotal(status: PropertieStatus) {
    try {
      console.log('status', status);
      const [res, total] = await this.propertiesRepository.findAndCount({
        where: {
          status,
        },
      });
      if (res) {
        return {
          success: true,
          msg: 'Thành công',
          total,
        };
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }
  async findAll(query: FilterPropertyDto): Promise<any> {
    try {
      const itemPerPage = Number(query.items_per_page) || 10;
      const page = Number(query.page) || 1;
      const skip = (page - 1) * itemPerPage;

      const searchKeyword = query.search ? `%${query.search}%` : '%';
      const where: any = {
        title: Like(searchKeyword),
        status: 'approved',
      };

      if (query.provinceId) {
        where.province = { id: Number(query.provinceId) };
      }
      if (query.districtId) {
        where.district = { id: Number(query.districtId) };
      }
      if (query.excludeIds) {
        where.id = Not(query.excludeIds);
      }
      if (query.packageTypeId) {
        where.package_type = { id: query.packageTypeId };
      }
      if (query.LevelPackageType) {
        where.package_type = { priority_level: Number(query.LevelPackageType) };
      }
      if (query.listingType) {
        where.property_type_id = { listingType: query.listingType };
      }
      if (query.PropertyTypeId) {
        where.property_type_id = { id: query.PropertyTypeId };
      }
      if (query.minPrice && query.maxPrice) {
        where.price = Between(Number(query.minPrice), Number(query.maxPrice));
      } else if (query.minPrice) {
        where.price = Between(Number(query.minPrice), Number.MAX_SAFE_INTEGER);
      } else if (query.maxPrice) {
        where.price = Between(0, Number(query.maxPrice));
      }
      if (query.minSquareMeter && query.maxSquareMeter) {
        where.square_meter = Between(
          Number(query.minSquareMeter),
          Number(query.maxSquareMeter),
        );
      } else if (query.minSquareMeter) {
        where.square_meter = Between(
          Number(query.minSquareMeter),
          Number.MAX_SAFE_INTEGER,
        );
      } else if (query.maxSquareMeter) {
        where.square_meter = Between(0, Number(query.maxSquareMeter));
      }

      const [res, total] = await this.propertiesRepository.findAndCount({
        where,

        order: {
          package_type: {
            priority_level: 'DESC',
          },
          price: query.sortPrice?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
          square_meter:
            query.sortSquareMeter?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
        },
        take: itemPerPage,
        skip: skip,
        relations: {
          package_type: true,
          province: true,
          idUser: true,
          property_type_id: true,
        },
        select: {
          idUser: {
            id: true,
            email: true,
            fullname: true,
            avatar: true,
            address: true,
          },
        },
      });

      const enrichedProperties = await Promise.all(
        res.map(async (item) => {
          const mainImage = await this.propertyImagesRepository.find({
            where: { property: { id: item.id } },
            select: {
              id: true,
              image_url: true,
              is_main: true,
              caption: true,
            },
          });

          return {
            ...item,
            mainImage,
          };
        }),
      );
      const lastPage = Math.ceil(total / itemPerPage);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 < 1 ? null : page - 1;

      return {
        success: true,
        data: enrichedProperties,
        // image,
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
          message: 'Failed to retrieve property.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllUser(
    query: FilterPropertyUserDto,
    idUser: string,
  ): Promise<any> {
    try {
      const itemPerPage = Number(query.items_per_page) || 10;
      const page = Number(query.page) || 1;
      const skip = (page - 1) * itemPerPage;
      const sortPrice =
        query.sortDirection?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      const searchKeyword = query.search ? `%${query.search}%` : '%';
      const where: any = {
        idUser: { id: idUser },
      };
      if (query.search) {
        where.id = query.search;
      }
      if (query.PropertyTypeId) {
        where.property_type_id = { id: query.PropertyTypeId };
      }
      if (query.provinceId) {
        where.province = { id: Number(query.provinceId) };
      }
      if (query.status) {
        where.status = query.status;
      }
      if (query.packageTypeId) {
        where.package_type = { id: query.packageTypeId };
      }
      if (query.minPrice && query.maxPrice) {
        where.price = Between(Number(query.minPrice), Number(query.maxPrice));
      } else if (query.minPrice) {
        where.price = Between(Number(query.minPrice), Number.MAX_SAFE_INTEGER);
      } else if (query.maxPrice) {
        where.price = Between(0, Number(query.maxPrice));
      }
      const [res, total] = await this.propertiesRepository.findAndCount({
        where,
        order: { price: sortPrice },
        take: itemPerPage,
        skip: skip,
        relations: {
          package_type: true,
          province: true,
          idUser: true,
          property_type_id: true,
        },
        select: {
          idUser: {
            id: true,
            email: true,
            fullname: true,
            avatar: true,
            address: true,
          },
        },
      });

      const enrichedProperties = await Promise.all(
        res.map(async (item) => {
          const mainImage = await this.propertyImagesRepository.find({
            where: { property: { id: item.id } },
            select: {
              id: true,
              image_url: true,
              is_main: true,
              caption: true,
            },
          });

          return {
            ...item,
            mainImage,
          };
        }),
      );
      const lastPage = Math.ceil(total / itemPerPage);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 < 1 ? null : page - 1;

      return {
        success: true,
        data: enrichedProperties,
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
          message: 'Failed to retrieve property.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findAllAdmin(query: FilterPropertyDto): Promise<any> {
    try {
      const itemPerPage = Number(query.items_per_page) || 10;
      const page = Number(query.page) || 1;
      const skip = (page - 1) * itemPerPage;
      const sortPrice =
        query.sortPrice?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      const searchKeyword = query.search ? `%${query.search}%` : '%';
      const where: any = {
        status: In(['approved', 'pending']),
      };
      if (query.search) {
        where.id = query.search;
      }
      if (query.provinceId) {
        where.province = { id: Number(query.provinceId) };
      }

      if (query.packageTypeId) {
        where.package_type = { id: query.packageTypeId };
      }
      if (query.listingType) {
        where.property_type_id = { listingType: query.listingType };
      }
      if (query.PropertyTypeId) {
        where.property_type_id = { id: query.PropertyTypeId };
      }
      if (query.minPrice && query.maxPrice) {
        where.price = Between(Number(query.minPrice), Number(query.maxPrice));
      } else if (query.minPrice) {
        where.price = Between(Number(query.minPrice), Number.MAX_SAFE_INTEGER);
      } else if (query.maxPrice) {
        where.price = Between(0, Number(query.maxPrice));
      }
      if (query.minSquareMeter && query.maxSquareMeter) {
        where.square_meter = Between(
          Number(query.minSquareMeter),
          Number(query.maxSquareMeter),
        );
      } else if (query.minSquareMeter) {
        where.square_meter = Between(
          Number(query.minSquareMeter),
          Number.MAX_SAFE_INTEGER,
        );
      } else if (query.maxSquareMeter) {
        where.square_meter = Between(0, Number(query.maxSquareMeter));
      }

      const [res, total] = await this.propertiesRepository.findAndCount({
        where,
        order: { price: sortPrice },
        take: itemPerPage,
        skip: skip,
        relations: {
          package_type: true,
          province: true,
          idUser: true,
          property_type_id: true,
        },
        select: {
          idUser: {
            email: true,
            fullname: true,
            avatar: true,
            address: true,
          },
          property_images: {
            id: true,
            image_url: true,
            is_main: true,
            caption: true,
          },
        },
      });

      const enrichedProperties = await Promise.all(
        res.map(async (item) => {
          const mainImage = await this.propertyImagesRepository.find({
            where: { property: { id: item.id } },
            select: {
              id: true,
              image_url: true,
              is_main: true,
              caption: true,
            },
          });

          return {
            ...item,
            mainImage,
          };
        }),
      );

      const lastPage = Math.ceil(total / itemPerPage);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 < 1 ? null : page - 1;

      return {
        success: true,
        data: enrichedProperties,
        // image,
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
          message: 'Failed to retrieve property.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async update(
    id: string,
    updatePropertiesDto: UpdatePropertiesDto,
  ): Promise<any> {
    const checkStatus = await this.propertiesRepository.findOne({
      where: {
        id,
      },
    });
    if (checkStatus.status === 'approved') {
      return {
        success: false,
        msg: 'Không thể chỉnh sửa tin này',
      };
    }
    try {
      const updateResult = await this.propertiesRepository.update(
        id,
        updatePropertiesDto,
      );

      if (updateResult.affected === 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'property not found!',
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
  async updateStatusExpired(idProperty: string) {
    try {
      const checkStatus = await this.propertiesRepository.findOne({
        where: {
          id: idProperty,
        },
      });
      if (checkStatus.status === 'approved') {
        checkStatus.status = PropertieStatus.EXPIRED;
        await this.propertiesRepository.save(checkStatus);
        return {
          success: true,
          msg: 'update thành công',
        };
      }
      return {
        success: false,
        msg: 'Không thể chỉnh sửa tin này',
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
  async getImageProperty(idProperty: string) {
    try {
      const res = await this.propertyImagesRepository.find({
        where: {
          property: { id: idProperty },
        },
        order: {
          createdAt: 'DESC',
        },
      });
      return {
        success: true,
        data: res,
      };
    } catch (error) {
      console.log(error);
    }
  }
  async updateImageMain(
    idImage: string,
    updateImageMainDto: UpdateImageMainDto,
  ) {
    try {
      const checkImage = await this.propertyImagesRepository.findOne({
        where: { propertyId: updateImageMainDto.idProperty, is_main: true },
      });
      console.log(checkImage);
      if (checkImage && updateImageMainDto.is_main === true) {
        await this.propertyImagesRepository.update(checkImage.id, {
          is_main: false,
        });
      }
      const res = await this.propertyImagesRepository.update(idImage, {
        is_main: updateImageMainDto.is_main,
      });
      if (res.affected === 0) {
        return {
          success: false,
          msg: 'lổi ko update được',
        };
      }
      return {
        success: true,
        msg: 'update thành công',
        checkImage,
      };
    } catch (error) {
      console.error('Unexpected error:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
  async deleteImage(ids: string): Promise<DeleteResult> {
    try {
      await this.cloudinaryService.deleteFile(ids);
      return await this.propertyImagesRepository.delete({ id: ids });
    } catch (error) {
      console.error('Error deleting files or database records:', error);
      throw new Error('Có lỗi xảy ra khi xóa dữ liệu');
    }
  }
  async delete(id: string): Promise<any> {
    try {
      const checkPropertyStatus = await this.propertiesRepository.findOne({
        where: { id },
      });
      if (checkPropertyStatus?.status === 'approved') {
        return {
          success: false,
          msg: 'không thể xóa',
        };
      }
      return await this.propertiesRepository.delete({ id });
    } catch (error) {
      console.error('Error deleting files or database records:', error);
      throw new Error('Có lỗi xảy ra khi xóa dữ liệu');
    }
  }
  async browsePost(id: string) {
    const checkPost = await this.propertiesRepository.findOne({
      where: {
        id,
      },
      relations: {
        package_type: true,
        province: true,
        idUser: true,
        property_type_id: true,
      },
    });
    if (checkPost && checkPost?.status !== 'pending') {
      return {
        success: false,
        msg: 'tin đăng không hợp lệ',
      };
    }
    try {
      const startDate = new Date();
      const endDate = new Date(
        startDate.getTime() +
          (checkPost.displayDays || 0) * 24 * 60 * 60 * 1000,
      );
      const res = await this.propertiesRepository.update(id, {
        status: PropertieStatus.APPROVED,
        start_date: startDate,
        end_date: endDate,
        postedAt: null,
      });
      if (res.affected !== 0) {
        return {
          success: true,
          msg: 'Tin đăng đã được duyệt',
          startDate,
          endDate,
        };
      }
      return {
        success: false,
        msg: 'tin đăng không hợp lệ',
      };
    } catch (error) {
      console.error('Lỗi duyệt tin:', error);
      return {
        success: false,
        msg: 'Đã xảy ra lỗi khi duyệt tin',
      };
    }
  }
  async Unpost(id: string, reasonUnpost: string) {
    console.log('reasonUnpost', reasonUnpost);
    const checkPost = await this.propertiesRepository.findOne({
      where: {
        id,
      },
      relations: {
        package_type: true,
        province: true,
        idUser: true,
        property_type_id: true,
      },
    });
    if (!checkPost) {
      return {
        success: false,
        msg: 'Không tìm thấy tin đăng',
      };
    }
    if (checkPost.status !== 'approved' && checkPost.status !== 'pending') {
      return {
        success: false,
        msg: 'Tin đăng không hợp lệ',
      };
    }
    try {
      if (checkPost.status === 'approved') {
        const currentDate = new Date();
        const startDate = new Date(checkPost.start_date);
        const usedDays = Math.ceil(
          (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        let refundAmount;
        const remainingDays = checkPost.displayDays - usedDays;
        if (remainingDays > 0) {
          refundAmount =
            (remainingDays / checkPost.displayDays) *
            checkPost.package_type.price;
        }
        const user = await this.UsersRepository.findOne({
          where: { id: checkPost.idUser.id },
        });
        if (user) {
          user.balance =
            Number(user.balance) + Math.round(Number(refundAmount));
          await this.UsersRepository.save(user);
          await this.transactionsRepository.save({
            amount: Math.round(Number(refundAmount)),
            transaction_type: transactionType.Refund,
            method: 'Hoàn trả tiền',
            balance: user.balance,
            idUser: user,
          });
        }
      }
      if (checkPost.status === PropertieStatus.PENDING) {
        const user = await this.UsersRepository.findOne({
          where: { id: checkPost.idUser.id },
        });
        if (user) {
          user.balance = Number(user.balance) + Number(checkPost.totalCost);
          await this.UsersRepository.save(user);
          await this.transactionsRepository.save({
            amount: Number(checkPost.totalCost),
            transaction_type: transactionType.Refund,
            method: 'Hoàn trả tiền',
            balance: user.balance,
            idUser: user,
          });
        }
      }
      const res = await this.propertiesRepository.update(id, {
        status: PropertieStatus.REJECTED,
        start_date: null,
        end_date: null,
        package_type: null,
      });
      if (res.affected !== 0) {
        const emailUser = await this.emailService.sendMail(
          checkPost.idUser.email,
          'batdongsanvn',
          'cancel-post-notification',
          {
            userName: checkPost.idUser.fullname,
            cancelReason: reasonUnpost,
            postId: id,
          },
        );
        return {
          success: true,
          msg: 'Tin đăng đã hủy',
        };
      }
      return {
        success: false,
        msg: 'có lổi',
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        msg: 'có lổi',
      };
    }
  }
  async addPost(User: Users, id: string, addPropertiesDto: AddPropertiesDto) {
    const checkPackageType = await this.PackageTypeRepository.findOne({
      where: { id: addPropertiesDto.package_type },
    });
    console.log('checkPackageType', checkPackageType);
    const CheckProperty = await this.propertiesRepository.findOne({
      where: {
        id,
      },
    });
    if (!CheckProperty) {
      return {
        success: false,
        msg: 'Không tìm thấy bài đăng!',
      };
    }
    if (
      Number(User.balance) <
      Number(checkPackageType.price) * addPropertiesDto.displayDays
    ) {
      return {
        success: false,
        msg: 'Số dư không đủ vui lòng nạp thêm !',
      };
    }
    try {
      const res = await this.propertiesRepository.update(id, {
        status: PropertieStatus.PENDING,
        postedAt: new Date(),
        displayDays: addPropertiesDto.displayDays,
        totalCost: addPropertiesDto.totalCost,
        package_type: checkPackageType,
        start_date: null,
        end_date: null,
      });
      if (res.affected > 0) {
        const updateBalance = await this.UsersRepository.update(User.id, {
          balance:
            Number(User.balance) -
            Number(checkPackageType.price) * addPropertiesDto.displayDays,
        });
        await this.transactionsRepository.save({
          amount: Number(checkPackageType.price) * addPropertiesDto.displayDays,
          transaction_type: transactionType.BuyPackages,
          method: checkPackageType.name,
          balance:
            Number(User.balance) -
            Number(checkPackageType.price) * addPropertiesDto.displayDays,
          idUser: User,
        });
        if (updateBalance.affected > 0)
          return {
            success: true,
            msg: 'Đăng tin thành công hảy chờ admin duyệt',
          };
      }
      return {
        success: false,
        msg: 'có lổi',
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        msg: 'có lổi',
      };
    }
  }
  async generateTitleAndDescription(
    createTitleDescAiDTO: CreateTitleDescAiDTO,
  ): Promise<any> {
    try {
      const checkPropertyType = await this.PropertyTypesRepository.findOne({
        where: {
          id: createTitleDescAiDTO.PropertyTypeId,
        },
      });
      if (checkPropertyType) {
        const prompt = `Tạo tiêu đề và mô tả tin đăng bất động sản cho căn hộ với các thông tin sau:
        - Loại bất động sản: ${checkPropertyType.name}
        - Địa chỉ: ${createTitleDescAiDTO.ward},${createTitleDescAiDTO.district},${createTitleDescAiDTO.province}
        - Diện tích: ${createTitleDescAiDTO.square_meter} m2
          ${checkPropertyType.bathroom ? '- Số phòng tắm: ' + createTitleDescAiDTO.bathroom : ''}
        ${checkPropertyType.bedroom ? '- Số phòng ngủ: ' + createTitleDescAiDTO.bedroom : ''}
        ${checkPropertyType.floor ? '- Số tầng: ' + createTitleDescAiDTO.floor : ''}
        ${checkPropertyType.Horizontal ? '- Chiều ngang: ' + createTitleDescAiDTO.Horizontal + 'm' : ''}
        ${checkPropertyType.Length ? '- Chiều dài: ' + createTitleDescAiDTO.Length + 'm' : ''}
        ${checkPropertyType.isFurniture ? '- Nội thất: ' + createTitleDescAiDTO.isFurniture : ''}
        ${checkPropertyType.direction ? '- Hướng chính: ' + createTitleDescAiDTO.direction : ''}
        ${checkPropertyType.balonDirection ? '- Hướng ban công: ' + createTitleDescAiDTO.balonDirection : ''}
        ${checkPropertyType.Legal ? '- Pháp lí: ' + createTitleDescAiDTO.Legal : ''}
        ${checkPropertyType.Road ? '- Đường: ' + createTitleDescAiDTO.Road : ''}
        ${checkPropertyType.Land_status ? '- Tình trạng đất: ' + createTitleDescAiDTO.Land_status : ''}
        ${checkPropertyType.Deposit_amount ? '- Tiền cọc: ' + createTitleDescAiDTO.Deposit_amount : ''}
        Hãy chỉ dùng các thông tin trên và tạo một tiêu đề hấp dẫn và mô tả chi tiết đặc điểm cho tin đăng bất động sản này.`;
        const genAI = new GoogleGenerativeAI(process.env.API_KEY_GOOGLE_GEMINI);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
        });
        const result = await model.generateContent(prompt);
        if (result) {
          return {
            success: true,
            msg: 'Thành công',
            data: result.response.text(),
          };
        }

        return {
          success: false,
          msg: 'Có lổi xảy ra',
        };
      }
      return {
        success: false,
        msg: 'Có lổi xảy ra',
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        msg: 'Có lổi xảy ra',
      };
    }
  }
}
