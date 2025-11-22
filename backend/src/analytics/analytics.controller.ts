import { Controller, Get, Query } from '@nestjs/common';
import { CompanyId } from 'src/auth/company-id.decorator';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('logs-per-machine')
  async getLogsPerMachine(@CompanyId('companyId') companyId: string) {
    return await this.analyticsService.getLogsPerMachine(companyId);
  }

  @Get('downtime-per-machine')
  async getDowntimePerMachine(@CompanyId('companyId') companyId: string) {
    return await this.analyticsService.getDowntimePerMachine(companyId);
  }

  @Get('severity-distribution')
  async getSeverityDistribution(@CompanyId('companyId') companyId: string) {
    return await this.analyticsService.getSeverityDistribution(companyId);
  }

  @Get('downtime-trend')
  async getDowntimeTrend(
    @CompanyId('companyId') companyId: string,
    @Query('interval') interval: string,
  ) {
    return await this.analyticsService.getDowntimeTrend(companyId, interval);
  }

  @Get('issue-types')
  async getIssueTypes(@CompanyId('companyId') companyId: string) {
    return await this.analyticsService.getIssueTypes(companyId);
  }

  @Get('operator-activity')
  async getOperatorActivity(@CompanyId('companyId') companyId: string) {
    return await this.analyticsService.getOperatorActivity(companyId);
  }
}
