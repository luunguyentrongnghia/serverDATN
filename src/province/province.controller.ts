import { Controller, Get, Query } from '@nestjs/common';
import { query } from 'express';
import { Public } from 'src/users/decorator/public.decorator';
import { ProvinceService } from './province.service';

@Controller('province')
export class ProvinceController {
  constructor(private provinceService: ProvinceService) {}
  @Public()
  @Get('')
  async fetchProvincesFromAPI() {
    await this.provinceService.fetchProvincesFromAPI();
    return {
      msg: 'thành công',
    };
  }
  @Public()
  @Get('findAll')
  async getProvinces(@Query('idProvince') idProvince) {
    return await this.provinceService.getProvinces(Number(idProvince));
  }
}
