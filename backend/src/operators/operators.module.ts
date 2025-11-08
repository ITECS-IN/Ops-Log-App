import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OperatorsService } from './operators.service';
import { OperatorsController } from './operators.controller';
import { Operator, OperatorSchema } from './schemas/operator.schema';
import { Record, RecordSchema } from '../records/schemas/record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Operator.name, schema: OperatorSchema },
      { name: Record.name, schema: RecordSchema },
    ]),
  ],
  controllers: [OperatorsController],
  providers: [OperatorsService],
  exports: [OperatorsService],
})
export class OperatorsModule {}
