import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { instanceToPlain } from 'class-transformer';
import { UserStatus } from 'db/entities/users.entity';
import { Response } from 'express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Public } from './decorator/public.decorator';
import { Roles } from './decorator/roles.decorator';
import { FilterUserDto } from './dto/filter.dto';
import { LoginUserGoogleDto } from './dto/login-user-google.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private cloudinaryService: CloudinaryService,
  ) {}
  @Roles('admin')
  @Get('')
  getTransactions(@Query() query: FilterUserDto): Promise<any> {
    return this.usersService.getUserAdmin(query);
  }
  @Get('me')
  getMe(@Req() req: any) {
    return instanceToPlain(this.usersService.getMe(req.user.id));
  }
  @Roles('admin')
  @Get('total')
  getUserTotal(@Query() query: any) {
    return this.usersService.getUserTotal(query.status);
  }
  @Put('me')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    console.log(avatar);
    let avatarUrl;
    if (avatar) {
      avatarUrl = await this.cloudinaryService.uploadFile(avatar);
      updateUserDto.avatar = avatarUrl.url;
    }
    return this.usersService.update(
      req.user,
      updateUserDto,
      avatarUrl?.asset_id,
    );
  }
  @Public()
  @Get('has-user/:email')
  checkNewUserFromEmail(
    @Param('email') email: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<object> {
    return this.usersService.checkNewUserFromEmail(email, res);
  }
  @Public()
  @Post('loginWithGoogle')
  loginWithGoogle(
    @Body() loginUserGoogleDto: LoginUserGoogleDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<object> {
    console.log('check', loginUserGoogleDto);
    return this.usersService.loginWithGoogle(loginUserGoogleDto, res);
  }
  @Public()
  @Post('requestPwdOtp')
  requestPwdOTP(@Body() body: any) {
    return this.usersService.requestPwdOTP(body.email);
  }
  @Public()
  @Post('verifyPwdOTP')
  verifyPwdOTP(@Body() body: any) {
    return this.usersService.verifyPwdOTP(
      body.email,
      body.otp,
      body.newPassword,
    );
  }
  @Post('updatePaswordOtp')
  updatePaswordOtp(@Req() req: any) {
    return this.usersService.requestPwdOTP(req.user.email);
  }
  @Post('updatePasword')
  updatePasword(@Body() body: any, @Req() req: any) {
    return this.usersService.updatePasword(
      req.user.email,
      body.otp,
      body.newPassword,
      body.password,
    );
  }
  @Public()
  @Post('login')
  login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<object> {
    return this.usersService.login(loginUserDto, res);
  }
  @Public()
  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto): Promise<object> {
    return this.usersService.register(registerUserDto);
  }
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return {
      success: true,
      msg: 'Thành công',
    };
  }
  @Public()
  @Post('createAdmin')
  CreateAdminAcount(@Body() loginUserDto: LoginUserDto): Promise<object> {
    return this.usersService.CreateAdminAcount(loginUserDto);
  }
  @Public()
  @Put('verifyOtp/:otp')
  verifyOtp(@Param('otp') otp: string): Promise<object> {
    return this.usersService.verifyOtp(otp);
  }
  @Roles('admin')
  @Put(':id')
  UpdateStatus(@Param('id') id: string, @Body() body: any): Promise<object> {
    return this.usersService.UpdateStatus(body.status, id);
  }
}
