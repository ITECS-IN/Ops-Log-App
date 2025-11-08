import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { MachinesService } from './machines.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { CompanyId } from '../auth/company-id.decorator';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get()
  findAll(@CompanyId() companyId: string) {
    return this.machinesService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CompanyId() companyId: string) {
    return this.machinesService.findOne(id, companyId);
  }

  @Post()
  create(@Body() createDto: CreateMachineDto, @CompanyId() companyId: string) {
    return this.machinesService.create(createDto, companyId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateMachineDto) {
    return this.machinesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.machinesService.remove(id);
  }
}
