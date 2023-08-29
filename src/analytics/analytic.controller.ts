import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('total-finance')
  async getTotalFinance(): Promise<number> {
    return this.analyticsService.getTotalFinance();
  }

  @Get('total-clients')
  async getTotalClients(): Promise<number> {
    return this.analyticsService.getTotalClients();
  }
}
