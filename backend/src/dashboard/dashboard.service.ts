import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record } from '../records/schemas/record.schema';

@Injectable()
export class DashboardService {
  constructor(@InjectModel(Record.name) private recordModel: Model<Record>) {}

  async getStats(companyId: string) {
    // Use UTC boundaries for today
    const now = new Date();
    const startOfDay = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );
    const endOfDay = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0,
        0,
        0,
        0,
      ),
    );

    // 1. Total Logs Today (use createdAt)
    const totalLogsToday = await this.recordModel.countDocuments({
      companyId,
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });
    // 2. Total Downtime (Hours) for today (use createdAt)
    const downtimeRecords: Array<{
      downtimeStart?: Date;
      downtimeEnd?: Date;
      duration?: number;
    }> = await this.recordModel.find(
      {
        companyId,
        createdAt: { $gte: startOfDay, $lt: endOfDay },
        downtimeStart: { $ne: null },
        downtimeEnd: { $ne: null },
      },
      'downtimeStart downtimeEnd duration',
    );
    let totalDowntimeMin = 0;
    downtimeRecords.forEach((r) => {
      if (r.duration) {
        totalDowntimeMin += r.duration;
      } else if (r.downtimeStart && r.downtimeEnd) {
        totalDowntimeMin +=
          (new Date(r.downtimeEnd).getTime() -
            new Date(r.downtimeStart).getTime()) /
          60000;
      }
    });
    const totalDowntimeHours = totalDowntimeMin / 60;

    // 3. Average MTTR (Mean Time To Repair, in minutes) for today (use createdAt)
    // MTTR = average duration for closed breakdowns today
    const mttrRecords: Array<{ duration?: number }> =
      await this.recordModel.find(
        {
          companyId,
          createdAt: { $gte: startOfDay, $lt: endOfDay },
          noteType: 'Breakdown',
          status: 'Closed',
          duration: { $ne: null },
        },
        'duration',
      );
    let avgMTTR = 0;
    if (mttrRecords.length > 0) {
      avgMTTR =
        mttrRecords.reduce((sum: number, r) => sum + (r.duration || 0), 0) /
        mttrRecords.length;
    }

    // 4. Availability (%) for today
    // Availability = (Planned Production Time - Downtime) / Planned Production Time * 100
    // Assume 24h planned production for now (can be customized)
    const plannedProductionMin = 24 * 60;
    let availability =
      plannedProductionMin > 0
        ? ((plannedProductionMin - totalDowntimeMin) / plannedProductionMin) *
          100
        : 0;
    // Clamp to [0, 100]
    availability = Math.max(0, Math.min(100, availability));

    return {
      totalLogsToday,
      totalDowntimeHours: Number(totalDowntimeHours.toFixed(2)),
      avgMTTR: Number(avgMTTR.toFixed(2)),
      availability: Number(availability.toFixed(2)),
    };
  }
}
