import { Controller, Get, Put, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CompanyId } from '../auth/company-id.decorator';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @ApiOperation({ summary: 'Get company for authenticated user' })
  @ApiResponse({ status: 200, description: 'Company found.' })
  async getCompany(@CompanyId() companyId: string) {
    return this.companyService.getCompany(companyId);
  }

  @Put()
  @ApiOperation({ summary: 'Update company' })
  @ApiBody({ type: Object }) // Replace Object with a DTO class for better docs
  @ApiResponse({ status: 200, description: 'Company updated.' })
  async updateCompany(@Body() body: any, @CompanyId() companyId: string) {
    return this.companyService.updateCompany(body, companyId);
  }
}
