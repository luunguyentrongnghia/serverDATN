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
} from '@nestjs/common';
import { Public } from 'src/users/decorator/public.decorator';
import { Roles } from 'src/users/decorator/roles.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { FilterPropertyTypeDto } from './dto/filter.dto';
import { UpdatePropertyTypeDto } from './dto/update-property-type.dto';
import { PropertyTypesService } from './property-types.service';

@Controller('property-types')
export class PropertyTypesController {
  constructor(private propertyTypesService: PropertyTypesService) {}
  @Roles('admin')
  @Post('')
  create(@Body() createPropertyTypeDto: CreatePropertyTypeDto) {
    return this.propertyTypesService.create(createPropertyTypeDto);
  }
  @Public()
  @Get()
  findAll(@Query() query: FilterPropertyTypeDto): Promise<any> {
    return this.propertyTypesService.findAll(query);
  }
  @Get('all')
  getAll(): Promise<any> {
    return this.propertyTypesService.getAll();
  }
  @Get(':id')
  findDetail(@Param('id') id: string) {
    return this.propertyTypesService.findDetail(id);
  }
  @Roles('admin')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyTypeDto: UpdatePropertyTypeDto,
  ): Promise<UpdateResult> {
    return this.propertyTypesService.update(id, updatePropertyTypeDto);
  }
  @Roles('admin')
  @Delete()
  deleteMultiple(@Body('ids') ids: string[]): Promise<DeleteResult> {
    return this.propertyTypesService.delete(ids);
  }
}
