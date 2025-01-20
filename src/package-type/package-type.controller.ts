import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Public } from 'src/users/decorator/public.decorator';
import { Roles } from 'src/users/decorator/roles.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreatePackageTypeDto } from './dto/create-package-type.dto';
import { FilterPackageTypeDto } from './dto/filter.dto';
import { UpdatePackageTypeDto } from './dto/update-package-type.dto';
import { PackageTypeService } from './package-type.service';

@Controller('package-type')
export class PackageTypeController {
  constructor(private packageTypeService: PackageTypeService) {}
  @Roles('admin')
  @Post('')
  create(@Body() createPackageTypeDto: CreatePackageTypeDto) {
    return this.packageTypeService.create(createPackageTypeDto);
  }
  @Roles('admin')
  @Get()
  findAll(@Query() query: FilterPackageTypeDto): Promise<any> {
    return this.packageTypeService.findAll(query);
  }
  @Public()
  @Get('all')
  getAll(): Promise<any> {
    return this.packageTypeService.getAll();
  }
  @Roles('admin')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() uupdatePackageTypeDto: UpdatePackageTypeDto,
  ): Promise<UpdateResult> {
    return this.packageTypeService.update(id, uupdatePackageTypeDto);
  }
  @Roles('admin')
  @Delete()
  deleteMultiple(@Body('ids') ids: string[]): Promise<DeleteResult> {
    return this.packageTypeService.delete(ids);
  }
}
