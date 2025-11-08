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
  findAll(@CompanyId() companyId: string) {
    return this.operatorsService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CompanyId() companyId: string) {
    return this.operatorsService.findOne(id, companyId);
  }

  @Post()
  create(@Body() createDto: CreateOperatorDto, @CompanyId() companyId: string) {
    return this.operatorsService.create(createDto, companyId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateOperatorDto) {
    return this.operatorsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.operatorsService.remove(id);
  }
}
