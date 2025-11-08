import { Controller, Get, Query } from '@nestjs/common';
import { CompanyId } from 'src/auth/company-id.decorator';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('logs-per-machine')
  getLogsPerMachine(@CompanyId('companyId') companyId: string) {
    return this.analyticsService.getLogsPerMachine(companyId);
  }

  @Get('downtime-per-machine')
  getDowntimePerMachine(@CompanyId('companyId') companyId: string) {
    return this.analyticsService.getDowntimePerMachine(companyId);
  }

  @Get('severity-distribution')
  getSeverityDistribution(@CompanyId('companyId') companyId: string) {
    return this.analyticsService.getSeverityDistribution(companyId);
  }

  @Get('downtime-trend')
  getDowntimeTrend(
    @CompanyId('companyId') companyId: string,
    @Query('interval') interval: string,
  ) {
    return this.analyticsService.getDowntimeTrend(companyId, interval);
  }

  @Get('issue-types')
  getIssueTypes(@CompanyId('companyId') companyId: string) {
    return this.analyticsService.getIssueTypes(companyId);
  }

  @Get('operator-activity')
  getOperatorActivity(@CompanyId('companyId') companyId: string) {
    return this.analyticsService.getOperatorActivity(companyId);
  }
}
