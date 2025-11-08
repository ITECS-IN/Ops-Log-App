import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Machine extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Line', required: true })
  lineId: Types.ObjectId;

  @Prop({ required: true })
  machineName: string;

  @Prop()
  status?: string;

  @Prop()
  location?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: string;
}

export const MachineSchema = SchemaFactory.createForClass(Machine);
