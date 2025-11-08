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
  findAll(@CompanyId() companyId: string) {
    return this.linesService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CompanyId() companyId: string) {
    return this.linesService.findOne(id, companyId);
  }

  @Post()
  create(@Body() body: any, @CompanyId() companyId: string) {
    return this.linesService.create(body, companyId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.linesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linesService.remove(id);
  }
}
