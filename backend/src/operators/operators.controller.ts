import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { OperatorsService } from './operators.service';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { CompanyId } from '../auth/company-id.decorator';

@Controller('operators')
export class OperatorsController {
  constructor(private readonly operatorsService: OperatorsService) {}

  @Get()
  async findAll(@CompanyId() companyId: string) {
    return await this.operatorsService.findAll(companyId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CompanyId() companyId: string) {
    return await this.operatorsService.findOne(id, companyId);
  }

  @Post()
  async create(@Body() createDto: CreateOperatorDto, @CompanyId() companyId: string) {
    return await this.operatorsService.create(createDto, companyId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateOperatorDto) {
    return await this.operatorsService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.operatorsService.remove(id);
  }
}
