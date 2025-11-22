import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { LinesService } from './lines.service';
import { CompanyId } from '../auth/company-id.decorator';

@Controller('lines')
export class LinesController {
  constructor(private readonly linesService: LinesService) {}

  @Get()
  async findAll(@CompanyId() companyId: string) {
    return await this.linesService.findAll(companyId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CompanyId() companyId: string) {
    return await this.linesService.findOne(id, companyId);
  }

  @Post()
  async create(@Body() body: any, @CompanyId() companyId: string) {
    return await this.linesService.create(body, companyId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return await this.linesService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.linesService.remove(id);
  }
}
