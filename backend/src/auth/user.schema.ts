import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  uid: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: Types.ObjectId, ref: 'Company' })
  companyId: string;

  @Prop({ default: false })
  admin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
