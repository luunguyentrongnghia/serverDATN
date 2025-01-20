import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from 'db/entities/Province.entity';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
  ) {}

  // Lấy dữ liệu Provinces từ API
  async fetchProvincesFromAPI(): Promise<void> {
    try {
      const response = await axios.get(
        'https://vietnam-administrative-division-json-server-swart.vercel.app/province',
      );

      const provinces = response.data;
      for (const province of provinces) {
        const newProvince = new Province();
        newProvince.name = province.name;
        newProvince.id = province.idProvince;

        await this.provinceRepository.save(newProvince);
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  }
  async getProvinces(idProvince?: number) {
    const whereCondition = idProvince ? { id: idProvince } : {};
    try {
      const response = await this.provinceRepository.find({
        where: whereCondition,
      });
      if (response) {
        return {
          success: true,
          msg: 'thành công',
          data: response,
        };
      }
      return {
        success: false,
        msg: 'lổi',
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        msg: 'lổi',
      };
    }
  }
}
