import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Record } from './schemas/record.schema';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

export interface RecordFilter {
  lineId?: string;
  machineId?: string;
  downtimeStart?: string;
  downtimeEnd?: string;
  description?: string;
  status?: string;
  shift?: string;
  noteType?: string;
  dateTime?: string;
}

export interface PaginatedRecords {
  data: Record[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class RecordsService {
  constructor(@InjectModel(Record.name) private recordModel: Model<Record>) {}

  async findAll(
    filters: RecordFilter = {},
    page = 1,
    limit = 20,
    companyId: string,
  ): Promise<PaginatedRecords> {
    const query: { [key: string]: any } = { companyId };

    if (filters.lineId && filters.lineId !== '') {
      query.lineId = filters.lineId;
    }
    if (filters.machineId && filters.machineId !== '') {
      query.machineId = filters.machineId;
    }
    if (filters.downtimeStart) {
      query.downtimeStart = { $gte: new Date(filters.downtimeStart) };
    }
    if (filters.downtimeEnd) {
      query.downtimeEnd = { $lte: new Date(filters.downtimeEnd) };
    }
    if (filters.description) {
      query.description = { $regex: filters.description, $options: 'i' };
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.shift) {
      query.shift = filters.shift;
    }
    if (filters.noteType) {
      query.noteType = filters.noteType;
    }
    if (filters.dateTime) {
      const date = new Date(filters.dateTime);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      query.dateTime = { $gte: date, $lt: nextDate };
    }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.recordModel
        .find(query)
        .populate('lineId', 'lineName')
        .populate('machineId', 'machineName location')
        // .populate('operatorId', 'name shift role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.recordModel.countDocuments(query),
    ]);
    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, companyId: string) {
    const record = await this.recordModel
      .findOne({ _id: id, companyId })
      .populate('lineId', 'lineName')
      .populate('machineId', 'machineName location')
      .populate('operatorId', 'name shift role');
    if (!record) throw new NotFoundException('Record not found');
    return record;
  }

  async create(createDto: CreateRecordDto, companyId: string) {
    const newRecord = new this.recordModel({ ...createDto, companyId });
    return newRecord.save();
  }

  async update(id: string, updateDto: UpdateRecordDto) {
    const updated = await this.recordModel.findOneAndUpdate(
      { _id: id },
      updateDto,
      { new: true },
    );
    if (!updated) throw new NotFoundException('Record not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.recordModel.findOneAndDelete({
      _id: id,
    });
    if (!deleted) throw new NotFoundException('Record not found');
    return deleted;
  }

  /** Optional helper: Get records by machine */
  async findByMachine(machineId: string, companyId: string) {
    return (
      this.recordModel
        .find({ machineId, companyId })
        .populate('lineId', 'lineName')
        // .populate('operatorId', 'name shift role')
        .exec()
    );
  }

  /** Optional helper: Get open records */
  async findOpen(companyId: string) {
    return (
      this.recordModel
        .find({ status: 'Open', companyId })
        .populate('machineId', 'machineName')
        // .populate('operatorId', 'name')
        .exec()
    );
  }

  /**
   * Return all records matching filters, no pagination, for CSV export
   */
  async findAllRaw(
    filters: RecordFilter = {},
    companyId: string,
  ): Promise<any[]> {
    if (!companyId) {
      throw new Error('companyId is required');
    }
    const query: { [key: string]: any } = { companyId };

    if (filters.lineId && filters.lineId !== '') {
      query.lineId = filters.lineId;
    }
    if (filters.machineId && filters.machineId !== '') {
      query.machineId = filters.machineId;
    }
    if (filters.downtimeStart) {
      query.downtimeStart = { $gte: new Date(filters.downtimeStart) };
    }
    if (filters.downtimeEnd) {
      query.downtimeEnd = { $lte: new Date(filters.downtimeEnd) };
    }
    if (filters.description) {
      query.description = { $regex: filters.description, $options: 'i' };
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.shift) {
      query.shift = filters.shift;
    }
    if (filters.noteType) {
      query.noteType = filters.noteType;
    }
    if (filters.dateTime) {
      const date = new Date(filters.dateTime);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      query.dateTime = { $gte: date, $lt: nextDate };
    }
    return this.recordModel
      .find(query)
      .populate('lineId', 'lineName')
      .populate('machineId', 'machineName location')
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }
}
