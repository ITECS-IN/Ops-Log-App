import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Line } from './schemas/line.schema';
import { Model } from 'mongoose';

import { InjectModel as InjectRecordModel } from '@nestjs/mongoose';
import { Record } from '../records/schemas/record.schema';

@Injectable()
export class LinesService {
  constructor(
    @InjectModel(Line.name) private lineModel: Model<Line>,
    @InjectRecordModel(Record.name) private recordModel: Model<Record>,
  ) {}

  async findAll(companyId: string) {
    return this.lineModel.find({ companyId }).exec();
  }

  async findOne(id: string, companyId: string) {
    const line = await this.lineModel.findOne({ _id: id, companyId });
    if (!line) throw new NotFoundException('Line not found');
    return line;
  }

  async create(data: Partial<Line>, companyId: string) {
    // Check if lineName is unique for this company
    const existing = await this.lineModel.findOne({
      lineName: data.lineName,
      companyId,
    });
    if (existing) {
      throw new BadRequestException(
        'Line name must be unique within your company.',
      );
    }
    const newLine = new this.lineModel({ ...data, companyId });
    return newLine.save();
  }

  async update(id: string, data: Partial<Line>) {
    // Find the line to get companyId
    const line = await this.lineModel.findById(id);
    if (!line) throw new NotFoundException('Line not found');
    // If lineName is being changed, check uniqueness within company
    if (data.lineName && data.lineName !== line.lineName) {
      const existing = await this.lineModel.findOne({
        lineName: data.lineName,
        companyId: line.companyId,
        _id: { $ne: id },
      });
      if (existing) {
        throw new BadRequestException(
          'Line name must be unique within your company.',
        );
      }
    }
    const updated = await this.lineModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Line not found');
    return updated;
  }

  async remove(id: string) {
    // Check if any record is associated with this line
    const associatedRecord = await this.recordModel.findOne({
      lineId: id,
    });
    if (associatedRecord) {
      throw new BadRequestException(
        'Cannot delete line: it is associated with existing records.',
      );
    }
    const deleted = await this.lineModel.findOneAndDelete({
      _id: id,
    });
    if (!deleted) throw new NotFoundException('Line not found');
    return deleted;
  }
}
