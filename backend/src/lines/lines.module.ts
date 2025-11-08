import { Module } from '@nestjs/common';
import { Line, LineSchema } from './schemas/line.schema';
import { LinesController } from './lines.controller';
import { LinesService } from './lines.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Record, RecordSchema } from '../records/schemas/record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Line.name, schema: LineSchema },
      { name: Record.name, schema: RecordSchema },
    ]),
  ],
  controllers: [LinesController],
  providers: [LinesService],
  exports: [LinesService],
})
export class LinesModule {}
