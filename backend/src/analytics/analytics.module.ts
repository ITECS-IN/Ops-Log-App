import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { MachinesModule } from '../machines/machines.module';
import { OperatorsModule } from '../operators/operators.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Record, RecordSchema } from '../records/schemas/record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Record.name, schema: RecordSchema }]),
    MachinesModule,
    OperatorsModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
