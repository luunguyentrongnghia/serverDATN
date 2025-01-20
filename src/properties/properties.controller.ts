import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePropertiesDto } from './dto/create-propertie.dto';
import { PropertiesService } from './properties.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadImageDto } from './dto/uploadImage.dto';
import { FilterPropertyDto } from './dto/filter.dto';
import { Public } from 'src/users/decorator/public.decorator';
import { FilterPropertyUserDto } from './dto/filterPropertyUser.dto';
import { UpdatePropertiesDto } from './dto/update-properties.dto';
import { UpdateImageMainDto } from './dto/updateImageMain.dto';
import { DeleteResult } from 'typeorm';
import { Roles } from 'src/users/decorator/roles.decorator';
import { AddPropertiesDto } from './dto/addPost';
import { Status } from 'src/users/decorator/status.decorator';
import { UserStatus } from 'db/entities/users.entity';
import { CreateTitleDescAiDTO } from './dto/CreateTitleDescAI';
@Controller('properties')
export class PropertiesController {
  constructor(
    private PropertiesService: PropertiesService,
    private cloudinaryService: CloudinaryService,
  ) {}
  @Status(UserStatus.Open)
  @Post('')
  create(@Req() req: any, @Body() createPropertiesDto: CreatePropertiesDto) {
    createPropertiesDto.idUser = req.user.id;
    console.log(createPropertiesDto);
    return this.PropertiesService.create(createPropertiesDto);
  }
  @Status(UserStatus.Open)
  @Post('uploadImage')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImageProperty(
    @Body() uploadImageDto: UploadImageDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    let imageUrl = await this.cloudinaryService.uploadFile(image);
    uploadImageDto.image_url = imageUrl.url;
    uploadImageDto.id = imageUrl.asset_id;
    return this.PropertiesService.uploadImageProperty(uploadImageDto);
  }
  @Public()
  @Get('all')
  All(): Promise<any> {
    return this.PropertiesService.getAll();
  }
  @Roles('admin')
  @Get('total')
  getUserTotal(@Query() query: any) {
    return this.PropertiesService.GetPropertyTotal(query.status);
  }
  @Public()
  @Get()
  findAll(@Query() query: FilterPropertyDto): Promise<any> {
    return this.PropertiesService.findAll(query);
  }
  @Status(UserStatus.Open)
  @Get('getPropertyUser')
  findAllUser(
    @Req() req: any,
    @Query() query: FilterPropertyUserDto,
  ): Promise<any> {
    return this.PropertiesService.findAllUser(query, req.user.id);
  }
  @Get('getPropertyAdmin')
  findAllAdmin(@Query() query: FilterPropertyUserDto): Promise<any> {
    return this.PropertiesService.findAllAdmin(query);
  }
  @Public()
  @Get(':id')
  getProperty(@Param('id') id: string): Promise<any> {
    return this.PropertiesService.getProperty(id);
  }
  @Status(UserStatus.Open)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertiesDto: UpdatePropertiesDto,
  ): Promise<any> {
    return this.PropertiesService.update(id, updatePropertiesDto);
  }
  @Status(UserStatus.Open)
  @Put('updateStatusExpired/:id')
  updateStatusExpired(@Param('id') id: string) {
    return this.PropertiesService.updateStatusExpired(id);
  }
  @Status(UserStatus.Open)
  @Get('getPropertyImage/:id')
  getImageProperty(@Param('id') id: string): Promise<any> {
    return this.PropertiesService.getImageProperty(id);
  }
  @Status(UserStatus.Open)
  @Put('updateImageMain/:id')
  updateImageMain(
    @Param('id') id: string,
    @Body() updateImageMainDto: UpdateImageMainDto,
  ): Promise<any> {
    return this.PropertiesService.updateImageMain(id, updateImageMainDto);
  }
  @Status(UserStatus.Open)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<any> {
    return this.PropertiesService.delete(id);
  }
  @Status(UserStatus.Open)
  @Delete('deleteImage')
  deleteImage(@Body('ids') ids: string): Promise<DeleteResult> {
    return this.PropertiesService.deleteImage(ids);
  }
  @Roles('admin')
  @Put('browsePost/:id')
  browsePost(@Param('id') id: string): Promise<any> {
    return this.PropertiesService.browsePost(id);
  }
  @Roles('admin')
  @Put('Unpost/:id')
  Unpost(@Param('id') id: string, @Body() body: any): Promise<any> {
    return this.PropertiesService.Unpost(id, body.reasonUnpost);
  }
  @Status(UserStatus.Open)
  @Put('addPost/:id')
  addPost(
    @Req() req: any,
    @Param('id') id: string,
    @Body() addPropertiesDto: AddPropertiesDto,
  ): Promise<any> {
    console.log(addPropertiesDto);
    return this.PropertiesService.addPost(req.user, id, addPropertiesDto);
  }
  @Status(UserStatus.Open)
  @Post('createTitleDescAI')
  generateTitleAndDescription(
    @Body() createTitleDescAiDTO: CreateTitleDescAiDTO,
  ) {
    return this.PropertiesService.generateTitleAndDescription(
      createTitleDescAiDTO,
    );
  }
}
