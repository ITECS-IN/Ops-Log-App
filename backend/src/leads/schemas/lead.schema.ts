import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Lead extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop()
  company?: string;

  @Prop()
  phone?: string;

  @Prop()
  notes?: string;

  @Prop({ default: 'landing-cta' })
  source?: string;

  @Prop()
  cta?: string;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
