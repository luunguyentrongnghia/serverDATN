import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole, Users, UserStatus } from 'db/entities/users.entity';
import {
  Between,
  DeleteResult,
  Like,
  MoreThanOrEqual,
  Repository,
  UpdateResult,
} from 'typeorm';
import { LoginUserGoogleDto } from './dto/login-user-google.dto';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto } from './dto/register-user.dto';
import * as crypto from 'crypto';
import { EmailService } from 'src/email/email.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FilterUserDto } from './dto/filter.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
    private cloudinaryService: CloudinaryService,
  ) {}
  private async hashPassword(password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    return passwordHash;
  }
  private async generateToken(id: string) {
    const access_token = await this.jwtService.signAsync(
      { id },
      {
        expiresIn: '600s',
      },
    );
    console.log(access_token);
    const refresh_token = await this.jwtService.signAsync(
      { id },
      {
        expiresIn: '7d',
      },
    );
    return {
      refresh_token,
      access_token,
    };
  }
  async verifyOtp(otp: string): Promise<any> {
    const checkOtp = await this.userRepository.findOne({ where: { otp } });
    if (!checkOtp) {
      return {
        success: false,
        msg: 'Mã otp không đúng.',
      };
    }
    checkOtp.emailVerified = true;
    checkOtp.otp = null;
    await this.userRepository.save(checkOtp);
    return {
      success: true,
      msg: 'Đăng ký thành công.',
    };
  }
  async registerEmail(registerUserDto: RegisterUserDto): Promise<any> {
    const { email, fullname, password } = registerUserDto;
    const hashedPassword = await this.hashPassword(password);
    const newUser = this.userRepository.create({
      email,
      fullname,
      password: hashedPassword,
    });
    const otp = crypto.randomInt(100000, 999999).toString();
    newUser.otp = otp;
    await this.userRepository.save(newUser);
    await this.emailService.sendMail(email, 'Xác thực người dùng', 'otp', {
      otp,
    });
    setTimeout(async () => {
      await this.userRepository.delete({ otp });
    }, 75000);
    return {
      success: true,
      msg: 'vui lòng kiểm tra email.',
    };
  }
  async register(registerUserDto: RegisterUserDto): Promise<any> {
    try {
      const { email } = registerUserDto;
      const checkUser = await this.userRepository.findOne({
        where: { email },
      });
      if (checkUser) {
        return {
          success: true,
          msg: 'Email đã được đăng ký.',
        };
      }
      return await this.registerEmail(registerUserDto);
    } catch (error) {
      console.log(error);
    }
  }
  async login(loginUserDto: LoginUserDto, res: Response): Promise<any> {
    try {
      const { email, password } = loginUserDto;

      let checkUser: any;
      if (email) {
        checkUser = await this.userRepository.findOne({ where: { email } });
      }
      if (!checkUser) {
        return {
          success: false,
          msg: 'tài khoản không tồn tại',
        };
      }
      const checkPass = bcrypt.compareSync(password, checkUser.password);
      if (!checkPass) {
        return {
          success: false,
          msg: 'sai mật khẩu',
        };
      }
      const token = await this.generateToken(checkUser.id);
      if (token) {
        res.cookie('access_token', token.access_token, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 10 * 60 * 1000, // 10 phút
        });

        res.cookie('refresh_token', token.refresh_token, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        });
      }
      return {
        success: !!token,
        accessToken: token.access_token,
        role: checkUser.role,
        msg: token ? 'Đăng nhập thành công' : 'Đăng nhập không thành công',
      };
    } catch (error) {
      console.log(error);
    }
  }

  async loginWithGoogle(
    loginUserGoogleDto: LoginUserGoogleDto,
    res: Response,
  ): Promise<any> {
    try {
      const checkUser = await this.userRepository.findOne({
        where: { email: loginUserGoogleDto.email },
      });
      let role: string;
      let uId: string;
      if (!checkUser) {
        loginUserGoogleDto.password = await this.hashPassword(
          loginUserGoogleDto.password,
        );
        const newUser = await this.userRepository.save({
          ...loginUserGoogleDto,
          emailVerified: true,
        });
        if (!newUser) {
          return {
            success: false,
            error: HttpStatus.NOT_FOUND,
            message: 'Something went wrong!',
          };
        }
        uId = newUser.id;
        role = newUser.role;
      } else {
        if (!checkUser.googleId) {
          return {
            success: false,
            message:
              'Email này đã được đăng ký bằng phương thức khác. Vui lòng sử dụng phương thức đăng nhập ban đầu.',
          };
        }
        uId = checkUser.id;
        role = checkUser.role;
      }
      const token = await this.generateToken(uId);
      if (token) {
        res.cookie('access_token', token.access_token, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 10 * 60 * 1000, // 10 phút
        });

        res.cookie('refresh_token', token.refresh_token, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        });
      }
      return {
        success: !!token,
        accessToken: token,
        role: role,
        msg: token ? 'Đăng nhập thành công' : 'Đăng nhập không thành công',
      };
    } catch (error) {
      console.log(error);
    }
  }
  async checkNewUserFromEmail(email: string, res: Response) {
    const checkUser = await this.userRepository.findOne({ where: { email } });
    let token = null;
    if (checkUser) {
      token = await this.generateToken(checkUser.id);
      res.cookie('access_token', token.access_token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 10 * 60 * 1000, // 10 phút
      });

      res.cookie('refresh_token', token.refresh_token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      });
    }
    return {
      succer: true,
      hasUser: !!checkUser,
      accessToken: token,
      msg: token ? 'Đăng nhập thành công' : 'New user',
    };
  }
  async requestPwdOTP(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return {
        success: false,
        msg: 'Không tìm thấy người dùng',
      };
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const UpdateOtpPass = await this.userRepository.save({
      ...user,
      resetPwdOtp: otp,
    });
    if (UpdateOtpPass) {
      await this.emailService.sendMail(email, 'Xác thực người dùng', 'otp', {
        otp,
      });
      setTimeout(async () => {
        await this.userRepository.update({ email }, { resetPwdOtp: null });
      }, 75000);
      return {
        success: true,
        msg: 'vui lòng kiểm tra email.',
      };
    }
    return {
      success: false,
      msg: 'Có lổi.',
    };
  }
  async verifyPwdOTP(email: string, otp: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return {
        success: false,
        msg: 'Không tìm thấy người dùng',
      };
    }
    if (Number(user.resetPwdOtp) !== Number(otp)) {
      return {
        success: false,
        msg: 'otp không đúng hoặc hết hạng',
      };
    }
    const hashedPassword = await this.hashPassword(newPassword);
    const updatePass = await this.userRepository.save({
      ...user,
      password: hashedPassword,
    });
    if (updatePass) {
      return {
        success: true,
        msg: 'Thành công vui lòng đăng nhập lại',
      };
    }
    return {
      success: false,
      msg: 'Có lổi',
    };
  }
  async updatePasword(
    email: string,
    otp: string,
    newPassword: string,
    password: string,
  ) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return {
        success: false,
        msg: 'Không tìm thấy người dùng',
      };
    }
    if (Number(user.resetPwdOtp) !== Number(otp)) {
      return {
        success: false,
        msg: 'otp không đúng hoặc hết hạng',
      };
    }
    const checkPass = bcrypt.compareSync(password, user.password);
    if (!checkPass) {
      return {
        success: false,
        msg: 'sai mật khẩu',
      };
    }
    const hashedPassword = await this.hashPassword(newPassword);
    const updatePass = await this.userRepository.save({
      ...user,
      password: hashedPassword,
    });
    if (updatePass) {
      return {
        success: true,
        msg: 'Thành công vui lòng đăng nhập lại',
      };
    }
    return {
      success: false,
      msg: 'Có lổi',
    };
  }
  async CreateAdminAcount(loginUserDto: LoginUserDto) {
    const hashedPassword = await this.hashPassword(loginUserDto.password);
    const newUser = this.userRepository.create({
      email: loginUserDto.email,
      emailVerified: true,
      fullname: 'admin',
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    if (newUser) {
      return await this.userRepository.save(newUser);
    }
    return {
      success: true,
      msg: 'lổi',
    };
  }
  async getMe(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }
  async update(
    user: any,
    updateUserDto: UpdateUserDto,
    id_avatar?: string,
  ): Promise<UpdateResult> {
    try {
      if (updateUserDto.province) {
        user.province = Number(updateUserDto.province);
      }

      if (updateUserDto.district) {
        user.district = Number(updateUserDto.district);
      }

      if (updateUserDto.ward) {
        user.ward = Number(updateUserDto.ward);
      }
      if (updateUserDto.email) user.email = updateUserDto.email;
      if (updateUserDto.fullname) user.fullname = updateUserDto.fullname;
      if (updateUserDto.address) user.address = updateUserDto.address;
      if (updateUserDto.avatar && id_avatar) {
        if (user.avatar && user.avatar_id) {
          const data = await this.cloudinaryService.deleteFile(user.avatar_id);
          console.log(data);
        }
        user.avatar = updateUserDto.avatar;
        user.avatar_id = id_avatar;
      }
      if (updateUserDto.phone) user.phone = updateUserDto.phone;
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error('Unexpected error:', error);
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    }
  }
  // async delete(id: string): Promise<DeleteResult> {
  //   this.userRepository.delete(id);
  //   return await this.userRepository.delete(id);
  // }
  async getUserTotal(status: UserStatus) {
    try {
      const [res, total] = await this.userRepository.findAndCount({
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
      return {
        success: false,
        msg: 'Có lổi',
      };
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }
  async getUserAdmin(query: FilterUserDto) {
    try {
      const itemPerPage = Number(query.items_per_page) || 10;
      const page = Number(query.page) || 1;
      const skip = (page - 1) * itemPerPage;
      const searchKeyword = query.search ? `%${query.search}%` : '%';
      const sortDate = query.sortDate?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      let where: any = [
        { role: UserRole.USER, fullname: Like(searchKeyword) },
        { role: UserRole.USER, email: Like(searchKeyword) },
      ];
      if (query.DaysAgo) {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - Number(query.DaysAgo));
        where[0].createdAt = MoreThanOrEqual(pastDate);
        where[1].createdAt = MoreThanOrEqual(pastDate);
      } else if (query.startDate && query.endDate) {
        const startDate = query.startDate + ' 00:00:00';
        const endDate = query.endDate + ' 00:00:00';
        console.log(endDate);
        where[0].createdAt = Between(startDate, endDate);
        where[1].createdAt = Between(startDate, endDate);
      }
      const [res, total] = await this.userRepository.findAndCount({
        where,
        take: itemPerPage,
        skip: skip,
        order: { createdAt: sortDate },
        select: {
          id: true,
          email: true,
          fullname: true,
          avatar: true,
          address: true,
          balance: true,
          createdAt: true,
          status: true,
          role: true,
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
          message: 'Failed to retrieve user.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async UpdateStatus(status: UserStatus, id: string) {
    try {
      const UserData = await this.userRepository.findOne({
        where: {
          id,
        },
      });
      if (!UserData) {
        return {
          success: false,
          msg: 'Lổi không thể cập nhật',
        };
      }

      UserData.status = status;
      const updatedUser = await this.userRepository.save(UserData);

      return {
        success: true,
        msg: 'Cập nhật thành công',
        data: updatedUser,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve user.',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
