import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  summary() {
    return this.dashboardService.summary();
  }

  @Get('service-orders-by-status')
  serviceOrdersByStatus() {
    return this.dashboardService.serviceOrdersByStatus();
  }

  @Get('revenue-by-period')
  revenueByPeriod() {
    return this.dashboardService.revenueByPeriod();
  }
}
