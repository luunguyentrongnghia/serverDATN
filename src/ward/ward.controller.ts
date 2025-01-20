import { Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/users/decorator/public.decorator';
import { WardService } from './ward.service';

@Controller('ward')
export class WardController {
  constructor(private wardService: WardService) {}
  @Public()
  @Get('')
  async fetchWardsFromAPI() {
    await this.wardService.fetchWardsFromAPI();
    return {
      msg: 'thành công',
    };
  }
  @Public()
  @Get('findAll')
  async getProvinces(@Query('idWard') idWard, @Query('idDistrict') idDistrict) {
    return await this.wardService.getDistricts(
      Number(idWard),
      Number(idDistrict),
    );
  }
}
