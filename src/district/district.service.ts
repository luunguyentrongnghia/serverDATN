import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { District } from 'db/entities/District.entity';
import { Province } from 'db/entities/Province.entity';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private districtRepository: Repository<District>,
  ) {}

  // Lấy danh sách các quận theo idProvince
  async fetchDistrictsFromAPI(): Promise<void> {
    try {
      const response = await axios.get(
        `https://vietnam-administrative-division-json-server-swart.vercel.app/district`,
      );

      const districts = response.data;

      // Lưu dữ liệu vào cơ sở dữ liệu
      for (const district of districts) {
        const newDistrict = new District();
        newDistrict.name = district.name;
        newDistrict.id = district.idDistrict;
        newDistrict.province = district.idProvince;

        await this.districtRepository.save(newDistrict);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  }
  async getDistricts(idProvince?: number, idDistrict?: number) {
    try {
      // Tạo đối tượng whereCondition dựa trên điều kiện
      const whereCondition: any = {};
      if (idDistrict) {
        whereCondition.id = idDistrict;
      }
      if (idProvince) {
        whereCondition.province = { id: idProvince };
      }

      const response = await this.districtRepository.find({
        where: whereCondition,
        select: {
          province: {
            id: true,
            name: true,
          },
        },
      });

      if (response) {
        return {
          success: true,
          msg: 'Thành công',
          data: response,
        };
      }

      return {
        success: false,
        msg: 'Không tìm thấy dữ liệu',
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        msg: 'Lỗi',
      };
    }
  }
}
