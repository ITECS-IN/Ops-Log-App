import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsDto {
  @ApiProperty({ example: 12, description: 'Total logs created today' })
  totalLogsToday: number;

  @ApiProperty({
    example: 2.5,
    description: 'Total downtime in hours for today',
  })
  totalDowntimeHours: number;

  @ApiProperty({
    example: 15.2,
    description: 'Average Mean Time To Repair (minutes) for today',
  })
  avgMTTR: number;

  @ApiProperty({
    example: 98.5,
    description: 'Availability percentage for today',
  })
  availability: number;
}
