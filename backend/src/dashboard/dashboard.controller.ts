import { Controller, Get } from '@nestjs/common';
import { CompanyId } from '../auth/company-id.decorator';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOkResponse({
    type: DashboardStatsDto,
    description: 'Dashboard statistics for today',
  })
  async getStats(@CompanyId() companyId: string): Promise<DashboardStatsDto> {
    return this.dashboardService.getStats(companyId);
  }
}
