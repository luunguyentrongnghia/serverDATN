import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { CreateInquiriesDto } from './dto/create.dto';
import { FilterInquiriesDto } from './dto/filter.dto';
import { InquiriesService } from './inquiries.service';

@Controller('inquiries')
export class InquiriesController {
  constructor(private inquiriesService: InquiriesService) {}
  @Get('')
  getInquiries(
    @Query() query: FilterInquiriesDto,
    @Req() req: any,
  ): Promise<any> {
    return this.inquiriesService.getInquiries(query, req.user.id);
  }
  @Post('')
  create(@Req() req: any, @Body() createInquiriesDto: CreateInquiriesDto) {
    return this.inquiriesService.createInquiries(createInquiriesDto, req.user);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.inquiriesService.UpdateStatus(id, body.status);
  }
}
