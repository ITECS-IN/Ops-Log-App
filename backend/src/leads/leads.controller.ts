import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createLead(@Body() createLeadDto: CreateLeadDto) {
    const lead = await this.leadsService.create(createLeadDto);
    return {
      message: 'Thanks for reaching out! Our team will contact you shortly.',
      leadId: lead.id,
    };
  }
}
