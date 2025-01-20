import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ward } from 'db/entities/Ward.entity';
import { nextTick } from 'process';

@Injectable()
export class WardService {
  constructor(
    @InjectRepository(Ward)
    private wardRepository: Repository<Ward>,
  ) {}

  // Lấy danh sách các xã/phường theo idDistrict
  async fetchWardsFromAPI(): Promise<void> {
    try {
      const response = await axios.get(
        `https://vietnam-administrative-division-json-server-swart.vercel.app/commune/`,
      );

      const wards = response.data;

      for (const ward of wards) {
        const newWard = new Ward();
        if (
          ward.idDistrict === '318' ||
          ward.idDistrict === '471' ||
          ward.idDistrict === '498' ||
          ward.idDistrict === '536' ||
          ward.idDistrict === '755'
        ) {
          continue;
        }
        newWard.name = ward.name;
        newWard.id = ward.idCommune;
        newWard.district = ward.idDistrict;

        await this.wardRepository.save(newWard);
      }
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  }
  async getDistricts(idWard?: number, idDistrict?: number) {
    try {
      // Tạo đối tượng whereCondition dựa trên điều kiện
      const whereCondition: any = {};
      if (idWard) {
        whereCondition.id = idWard;
      }
      if (idDistrict) {
        whereCondition.district = { id: idDistrict };
      }

      const response = await this.wardRepository.find({
        where: whereCondition,
        select: {
          district: {
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
