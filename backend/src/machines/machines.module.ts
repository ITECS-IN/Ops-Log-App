import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';
import { Machine, MachineSchema } from './schemas/machine.schema';
import { Record, RecordSchema } from '../records/schemas/record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Machine.name, schema: MachineSchema },
      { name: Record.name, schema: RecordSchema },
    ]),
  ],
  controllers: [MachinesController],
  providers: [MachinesService],
  exports: [MachinesService],
})
export class MachinesModule {}
