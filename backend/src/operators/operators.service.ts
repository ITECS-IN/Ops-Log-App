import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Operator } from './schemas/operator.schema';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';

import { InjectModel as InjectRecordModel } from '@nestjs/mongoose';
import { Record } from '../records/schemas/record.schema';

@Injectable()
export class OperatorsService {
  constructor(
    @InjectModel(Operator.name) private operatorModel: Model<Operator>,
    @InjectRecordModel(Record.name) private recordModel: Model<Record>,
  ) {}

  async findAll(companyId: string) {
    return this.operatorModel.find({ companyId }).exec();
  }

  async findOne(id: string, companyId: string) {
    const operator = await this.operatorModel.findOne({ _id: id, companyId });
    if (!operator) throw new NotFoundException('Operator not found');
    return operator;
  }

  async create(createDto: CreateOperatorDto, companyId: string) {
    const newOperator = new this.operatorModel({ ...createDto, companyId });
    return newOperator.save();
  }

  async update(id: string, updateDto: UpdateOperatorDto) {
    const updated = await this.operatorModel.findOneAndUpdate(
      { _id: id },
      updateDto,
      { new: true },
    );
    if (!updated) throw new NotFoundException('Operator not found');
    return updated;
  }

  async remove(id: string) {
    // Check if any record is associated with this operator
    const associatedRecord = await this.recordModel.findOne({ userId: id });
    if (associatedRecord) {
      throw new BadRequestException(
        'Cannot delete operator: it is associated with existing records.',
      );
    }
    const deleted = await this.operatorModel.findOneAndDelete({
      _id: id,
    });
    if (!deleted) throw new NotFoundException('Operator not found');
    return deleted;
  }
}
