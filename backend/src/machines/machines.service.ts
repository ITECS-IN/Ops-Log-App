import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Machine } from './schemas/machine.schema';
import { Model } from 'mongoose';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';

import { InjectModel as InjectRecordModel } from '@nestjs/mongoose';
import { Record } from '../records/schemas/record.schema';

@Injectable()
export class MachinesService {
  constructor(
    @InjectModel(Machine.name) private machineModel: Model<Machine>,
    @InjectRecordModel(Record.name) private recordModel: Model<Record>,
  ) {}

  async findAll(companyId: string) {
    return this.machineModel
      .find({ companyId })
      .populate('lineId', 'lineName')
      .exec();
  }

  async findOne(id: string, companyId: string) {
    const machine = await this.machineModel
      .findOne({ _id: id, companyId })
      .populate('lineId', 'lineName');
    if (!machine) throw new NotFoundException('Machine not found');
    return machine;
  }

  async create(createDto: CreateMachineDto, companyId: string) {
    // Ensure machineName is unique within the same line
    const existing = await this.machineModel.findOne({
      machineName: createDto.machineName,
      lineId: createDto.lineId,
      companyId,
    });
    if (existing) {
      throw new BadRequestException(
        'Machine name must be unique within the same line.',
      );
    }
    const newMachine = new this.machineModel({ ...createDto, companyId });
    return newMachine.save();
  }

  async update(id: string, updateDto: UpdateMachineDto) {
    // Find the machine to get lineId and companyId
    const machine = await this.machineModel.findById(id);
    if (!machine) throw new NotFoundException('Machine not found');
    // If machineName or lineId is being changed, check uniqueness within the line
    const newMachineName = updateDto.machineName ?? machine.machineName;
    const newLineId = updateDto.lineId ?? machine.lineId;
    if (
      (updateDto.machineName && updateDto.machineName !== machine.machineName) ||
      (updateDto.lineId && updateDto.lineId.toString() !== machine.lineId.toString())
    ) {
      const existing = await this.machineModel.findOne({
        machineName: newMachineName,
        lineId: newLineId,
        companyId: machine.companyId,
        _id: { $ne: id },
      });
      if (existing) {
        throw new BadRequestException(
          'Machine name must be unique within the same line.',
        );
      }
    }
    const updated = await this.machineModel.findOneAndUpdate(
      { _id: id },
      updateDto,
      { new: true },
    );
    if (!updated) throw new NotFoundException('Machine not found');
    return updated;
  }

  async remove(id: string) {
    // Check if any record is associated with this machine
    const associatedRecord = await this.recordModel.findOne({ machineId: id });
    if (associatedRecord) {
      throw new BadRequestException(
        'Cannot delete machine: it is associated with existing records.',
      );
    }
    const deleted = await this.machineModel.findOneAndDelete({ _id: id });
    if (!deleted) throw new NotFoundException('Machine not found');
    return deleted;
  }
}
