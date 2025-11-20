import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Record } from '../records/schemas/record.schema';
import { MachinesService } from '../machines/machines.service';
import { User } from '../auth/user.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Record.name) private recordModel: Model<Record>,
    private machinesService: MachinesService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getLogsPerMachine(
    companyId: string,
  ): Promise<{ _id: string; label: string; value: number }[]> {
    // 1. Get all machines for this company using MachinesService
    const machines = (await this.machinesService.findAll(companyId)) as Array<{
      _id: Types.ObjectId | string;
      machineName: string;
    }>;

    const matchCompany = {
      $or: [
        { companyId: new Types.ObjectId(companyId) },
        { companyId: companyId },
      ],
    };
    // 2. Get log counts per machine
    const logCounts: Array<{ _id: string; value: number }> =
      await this.recordModel.aggregate([
        { $match: matchCompany },
        { $group: { _id: '$machineId', value: { $sum: 1 } } },
      ]);

    // 3. Map machineId to count
    const countMap = new Map<string, number>();
    for (const item of logCounts) {
      countMap.set(String(item._id), item.value);
    }

    // 4. Return all machines with their log count (0 if none)
    const result = machines.map((m) => ({
      _id: String(m._id),
      label: m.machineName,
      value: countMap.get(String(m._id)) || 0,
    }));
    return result;
  }

  async getDowntimePerMachine(
    companyId: string,
  ): Promise<{ _id: string; label: string; value: number }[]> {
    // 1. Get all machines for this company using MachinesService
    const machines = (await this.machinesService.findAll(companyId)) as Array<{
      _id: Types.ObjectId | string;
      machineName: string;
    }>;

    const matchCompany = {
      $or: [
        { companyId: new Types.ObjectId(companyId) },
        { companyId: companyId },
      ],
    };
    // 2. Get downtime per machine
    const downtimeCounts: Array<{ _id: string; value: number }> =
      await this.recordModel.aggregate([
        { $match: matchCompany },
        { $group: { _id: '$machineId', value: { $sum: '$duration' } } },
      ]);

    // 3. Map machineId to downtime
    const countMap = new Map<string, number>();
    for (const item of downtimeCounts) {
      countMap.set(String(item._id), item.value);
    }

    // 4. Return all machines with their downtime (0 if none)
    const result = machines.map((m) => ({
      _id: String(m._id),
      label: m.machineName,
      value: countMap.get(String(m._id)) || 0,
    }));
    return result;
  }

  async getSeverityDistribution(
    companyId: string,
  ): Promise<{ _id: string; label: string; value: number }[]> {
    const matchCompany = {
      $or: [
        { companyId: new Types.ObjectId(companyId) },
        { companyId: companyId },
      ],
    };
    const res: Array<{ _id: string; value: number }> =
      await this.recordModel.aggregate([
        { $match: matchCompany },
        { $group: { _id: '$severity', value: { $sum: 1 } } },
      ]);
    return res.map((item) => ({ ...item, label: String(item._id) }));
  }

  async getDowntimeTrend(
    companyId: string,
    interval: string = 'day',
  ): Promise<{ _id: string; label: string; value: number; count: number }[]> {
    let dateFormat = '%Y-%m-%d';
    if (interval === 'week') dateFormat = '%Y-%U';
    if (interval === 'month') dateFormat = '%Y-%m';
    const matchCompany = {
      $or: [
        { companyId: new Types.ObjectId(companyId) },
        { companyId: companyId },
      ],
      downtimeStart: { $ne: null },
    };
    const res: Array<{ _id: string; value: number; count: number }> =
      await this.recordModel.aggregate([
        {
          $match: matchCompany,
        },
        {
          $addFields: {
            downtimeStartDate: {
              $cond: [
                { $ifNull: ['$downtimeStart', false] },
                { $toDate: '$downtimeStart' },
                null,
              ],
            },
          },
        },
        { $match: { downtimeStartDate: { $ne: null } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: dateFormat,
                date: '$downtimeStartDate',
              },
            },
            value: { $sum: '$duration' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
    return res.map((item) => ({ ...item, label: String(item._id) }));
  }

  async getIssueTypes(
    companyId: string,
  ): Promise<{ _id: string; label: string; value: number }[]> {
    const matchCompany = {
      $or: [
        { companyId: new Types.ObjectId(companyId) },
        { companyId: companyId },
      ],
    };

    // 2. Get issue type counts per machine
    const issueTypeCounts: Array<{ _id: string; value: number }> =
      await this.recordModel.aggregate([
        { $match: matchCompany },
        { $group: { _id: '$noteType', value: { $sum: 1 } } },
      ]);

    // 3. Map noteType to count
    const countMap = new Map<string, number>();
    for (const item of issueTypeCounts) {
      countMap.set(String(item._id), item.value);
    }

    // 4. Return all issue types with their count (0 if none)
    // If you want to return all possible noteTypes, you need a source of all possible noteTypes.
    // If not, just return the found ones:
    const result = issueTypeCounts.map((item) => ({
      _id: String(item._id),
      label: String(item._id),
      value: item.value,
    }));
    return result;
  }

  async getOperatorActivity(
    companyId: string,
  ): Promise<{ _id: string; label: string; value: number }[]> {
    const matchCompany = {
      $or: [
        { companyId: new Types.ObjectId(companyId) },
        { companyId: companyId },
      ],
    };
    const users = await this.userModel
      .find({
        companyId,
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
      })
      .lean();

    const logCounts: Array<{ _id: string; value: number }> =
      await this.recordModel.aggregate([
        { $match: matchCompany },
        { $group: { _id: '$userId', value: { $sum: 1 } } },
      ]);

    const countMap = new Map<string, number>();
    for (const item of logCounts) {
      countMap.set(String(item._id), item.value);
    }

    const result = users.map((user) => ({
      _id: user.uid,
      label: user.employeeCode
        ? `${user.employeeCode} – ${user.email}`
        : user.email,
      value: countMap.get(String(user.uid)) || 0,
    }));
    return result;
  }
}
