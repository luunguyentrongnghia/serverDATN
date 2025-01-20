import { Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/users/decorator/public.decorator';
import { DistrictService } from './district.service';

@Controller('district')
export class DistrictController {
  constructor(private districtService: DistrictService) {}
  @Public()
  @Get('')
  async fetchDistrictsFromAPI() {
    await this.districtService.fetchDistrictsFromAPI();
    return {
      msg: 'thành công',
    };
  }
  @Public()
  @Get('findAll')
  async getProvinces(
    @Query('idProvince') idProvince,
    @Query('idDistrict') idDistrict,
  ) {
    return await this.districtService.getDistricts(
      Number(idProvince),
      Number(idDistrict),
    );
  }
}
