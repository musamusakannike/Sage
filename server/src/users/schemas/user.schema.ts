import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserRole } from '../../common/enums';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String, unique: true, lowercase: true })
  email: string;

  @Prop({ required: false, type: String, select: false })
  passwordHash?: string;

  @Prop({ required: true, type: String, enum: Object.values(UserRole) })
  role: UserRole;

  @Prop({ required: true, type: String })
  orgName: string;

  @Prop({ type: Types.ObjectId, ref: 'Organisation' })
  orgId: Types.ObjectId;

  // OTP for passwordless sign-in (employees & auditors invited by HR)
  @Prop({ type: String, select: false })
  otpCode?: string;

  @Prop({ type: Date, select: false })
  otpExpiresAt?: Date;

  // Expo push notification token
  @Prop({ type: String })
  expoPushToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 });
UserSchema.index({ orgId: 1 });
