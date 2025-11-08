import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Company extends Document {
  @Prop({ required: true })
  companyName: string;

  @Prop({
    type: [
      raw({
        name: { type: String, required: true },
        start: { type: String, required: true }, // 'HH:mm' 24-hour
        end: { type: String, required: true }, // 'HH:mm' 24-hour
      }),
    ],
    required: false,
    default: [],
    validate: [
      (val: any[]) => Array.isArray(val) && val.length <= 3,
      'A maximum of 3 shifts is allowed.',
    ],
  })
  shiftTimings: Array<{ name: string; start: string; end: string }>;

  @Prop({ required: false })
  reportEmails: string; // comma separated

  @Prop({ required: false })
  logoUrl: string;

  @Prop({ required: false })
  companyLogoUrl: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
