import { Test, TestingModule } from '@nestjs/testing';
import { ReportPropertyController } from './report-property.controller';

describe('ReportPropertyController', () => {
  let controller: ReportPropertyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportPropertyController],
    }).compile();

    controller = module.get<ReportPropertyController>(ReportPropertyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
