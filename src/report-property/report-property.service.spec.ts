import { Test, TestingModule } from '@nestjs/testing';
import { ReportPropertyService } from './report-property.service';

describe('ReportPropertyService', () => {
  let service: ReportPropertyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportPropertyService],
    }).compile();

    service = module.get<ReportPropertyService>(ReportPropertyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
