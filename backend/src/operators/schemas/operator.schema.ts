import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Operator extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  employeeCode?: string;

  @Prop({ required: true })
  shift: string;

  @Prop({ default: 'Operator' })
  role?: string;

  @Prop({ required: true })
  pinCode: string;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: string;
}

export const OperatorSchema = SchemaFactory.createForClass(Operator);
