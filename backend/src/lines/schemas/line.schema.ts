import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Line extends Document {
  @Prop({ required: true })
  lineName: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: string;
}

export const LineSchema = SchemaFactory.createForClass(Line);
