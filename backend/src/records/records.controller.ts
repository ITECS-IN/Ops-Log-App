import {
  ApiOperation,
  ApiQuery,
  ApiProduces,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import {
  Res,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FirebaseStorageService } from '../firebase/firebase-storage.service';
import { Parser as Json2csvParser } from 'json2csv';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { CompanyId } from '../auth/company-id.decorator';

// Type-safe mapping for CSV export
type RecordCsv = {
  dateTime?: Date | string;
  lineId?: { lineName?: string };
  machineId?: { machineName?: string; location?: string };
  shift?: string;
  noteType?: string;
  severity?: string;
  description?: string;
  downtimeStart?: Date | string;
  downtimeEnd?: Date | string;
  duration?: number | string;
  status?: string;
};
@ApiTags('Records')
@Controller('records')
export class RecordsController {
  constructor(
    private readonly recordsService: RecordsService,
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}
  @Post('upload')
  @ApiOperation({ summary: 'Upload image or video for a record (max 12MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        path: { type: 'string', example: 'records/media/filename.jpg' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded.' })
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 12 * 1024 * 1024 } }),
  )
  async uploadFile(@UploadedFile() file: any, @Body('path') path: string) {
    if (!file) throw new Error('No file uploaded');
    if (!path) throw new Error('No path provided');
    const url = await this.firebaseStorageService.uploadFile(
      file.buffer,
      path,
      file.mimetype,
    );
    return { url };
  }

  @Get('export')
  @ApiOperation({ summary: 'Export records as CSV with filters' })
  @ApiProduces('text/csv')
  @ApiQuery({ name: 'lineId', required: false, type: String })
  @ApiQuery({ name: 'machineId', required: false, type: String })
  @ApiQuery({ name: 'downtimeStart', required: false, type: String })
  @ApiQuery({ name: 'downtimeEnd', required: false, type: String })
  @ApiQuery({ name: 'description', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'shift', required: false, type: String })
  @ApiQuery({ name: 'noteType', required: false, type: String })
  @ApiQuery({ name: 'dateTime', required: false, type: String })
  async exportCsv(
    @Query('lineId') lineId: string,
    @Query('machineId') machineId: string,
    @Query('downtimeStart') downtimeStart: string,
    @Query('downtimeEnd') downtimeEnd: string,
    @Query('description') description: string,
    @Query('status') status: string,
    @Query('shift') shift: string,
    @Query('noteType') noteType: string,
    @Query('dateTime') dateTime: string,
    @Res() res: import('express').Response,
    @CompanyId() companyId: string,
  ): Promise<void> {
    const records = await this.recordsService.findAllRaw(
      {
        lineId,
        machineId,
        downtimeStart,
        downtimeEnd,
        description,
        status,
        shift,
        noteType,
        dateTime,
      },
      companyId,
    );

    const mapped = records.map((r: RecordCsv) => ({
      'Date/Time': r?.dateTime ? new Date(r.dateTime).toLocaleString() : '',
      Line: r?.lineId?.lineName ?? '',
      Machine: r?.machineId?.machineName ?? '',
      Shift: r?.shift ?? '',
      'Note Type': r?.noteType ?? '',
      Severity: r?.severity ?? '',
      Description: r?.description ?? '',
      'Downtime Start': r?.downtimeStart
        ? new Date(r.downtimeStart).toLocaleString()
        : '',
      'Downtime End': r?.downtimeEnd
        ? new Date(r.downtimeEnd).toLocaleString()
        : '',
      'Duration (min)': r?.duration ?? '',
      Status: r?.status ?? '',
    }));
    const fields = [
      'Date/Time',
      'Line',
      'Machine',
      'Shift',
      'Note Type',
      'Severity',
      'Description',
      'Downtime Start',
      'Downtime End',
      'Duration (min)',
      'Status',
    ];
    const parser = new Json2csvParser({ fields });
    const csv = parser.parse(mapped);
    res.header('Content-Type', 'text/csv');
    res.attachment('records.csv');
    res.send(csv);
  }

  @Get()
  async findAll(
    @Query('lineId') lineId?: string,
    @Query('machineId') machineId?: string,
    @Query('downtimeStart') downtimeStart?: string,
    @Query('downtimeEnd') downtimeEnd?: string,
    @Query('description') description?: string,
    @Query('status') status?: string,
    @Query('shift') shift?: string,
    @Query('noteType') noteType?: string,
    @Query('dateTime') dateTime?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @CompanyId() companyId?: string,
  ) {
    // Sanitize ObjectId filters: convert empty string to undefined
    const safeLineId = lineId === '' ? undefined : lineId;
    const safeMachineId = machineId === '' ? undefined : machineId;
    return await this.recordsService.findAll(
      {
        lineId: safeLineId,
        machineId: safeMachineId,
        downtimeStart,
        downtimeEnd,
        description,
        status,
        shift,
        noteType,
        dateTime,
      },
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      companyId!,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CompanyId() companyId: string) {
    return await this.recordsService.findOne(id, companyId);
  }

  @Post()
  async create(@Body() createDto: CreateRecordDto, @CompanyId() companyId: string) {
    return await this.recordsService.create(createDto, companyId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateRecordDto) {
    return await this.recordsService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.recordsService.remove(id);
  }

  // Optional: extra routes
  @Get('machine/:machineId')
  async findByMachine(
    @Param('machineId') machineId: string,
    @CompanyId() companyId: string,
  ) {
    return await this.recordsService.findByMachine(machineId, companyId);
  }

  @Get('status/open')
  async findOpen(@CompanyId() companyId: string) {
    return await this.recordsService.findOpen(companyId);
  }
}
