import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead } from './schemas/lead.schema';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name) private readonly leadModel: Model<Lead>,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    const lead = new this.leadModel({
      ...createLeadDto,
      email: createLeadDto.email.trim().toLowerCase(),
      source: createLeadDto.source ?? 'landing-cta',
    });
    await lead.save();
    return lead;
  }
}
