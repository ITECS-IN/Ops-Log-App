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
  async findAll(@CompanyId() companyId: string) {
    return await this.machinesService.findAll(companyId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CompanyId() companyId: string) {
    return await this.machinesService.findOne(id, companyId);
  }

  @Post()
  async create(
    @Body() createDto: CreateMachineDto,
    @CompanyId() companyId: string,
  ) {
    return await this.machinesService.create(createDto, companyId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateMachineDto) {
    return await this.machinesService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.machinesService.remove(id);
  }
}
