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
import { CreateReportPropertyDto } from './dto/create.dto';
import { FilterReportPropertyDto } from './dto/filter.dto';
import { ReportPropertyService } from './report-property.service';

@Controller('report-property')
export class ReportPropertyController {
  constructor(private reportPropertyService: ReportPropertyService) {}

  @Get('')
  getReportProperty(@Query() query: FilterReportPropertyDto): Promise<any> {
    return this.reportPropertyService.getReportProperty(query);
  }
  @Post('')
  create(
    @Req() req: any,
    @Body() createReportPropertyDto: CreateReportPropertyDto,
  ) {
    return this.reportPropertyService.createReportProperty(
      createReportPropertyDto,
      req.user,
    );
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.reportPropertyService.UpdateStatus(
      id,
      body.status,
      body.assess,
      body.adminNote,
    );
  }
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.reportPropertyService.delete(id);
  }
}
