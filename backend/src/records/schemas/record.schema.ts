import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Record extends Document {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: Date, default: Date.now })
  dateTime: Date;

  @Prop({ type: Types.ObjectId, ref: 'Line', required: true })
  lineId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Machine', required: true })
  machineId: Types.ObjectId;

  @Prop({ type: String, enum: ['A', 'B', 'C'], required: true })
  shift: string;

  @Prop({
    type: String,
    enum: ['Observation', 'Breakdown', 'Setup', 'Quality'],
    required: true,
  })
  noteType: string;

  @Prop({ type: Number, min: 1, max: 5, required: true })
  severity: number;

  @Prop({ type: String, maxlength: 500 })
  description: string;

  @Prop({ type: String })
  photoUrl: string;

  @Prop({ type: String })
  fileUrl: string; // for image or video

  @Prop({ type: Date })
  downtimeStart: Date;

  @Prop({ type: Date })
  downtimeEnd: Date;

  @Prop({ type: Number })
  duration: number;

  @Prop({ type: String, enum: ['Open', 'Closed'], default: 'Open' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: string;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
