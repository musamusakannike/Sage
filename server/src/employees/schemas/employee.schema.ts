import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { EmployeeStatus } from '../../common/enums';

export type EmployeeDocument = HydratedDocument<Employee>;

@Schema({ timestamps: true, collection: 'employees' })
export class Employee {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  orgId: Types.ObjectId;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  roleTitle: string;

  @Prop({ required: false, type: String, default: null })
  accountNumber: string | null;

  @Prop({ required: false, type: String, sparse: true, default: null })
  phone: string | null;

  @Prop({ type: String, default: null })
  email: string | null;

  @Prop({ type: Number, default: null })
  dnaScore: number | null;

  @Prop({
    type: String,
    enum: Object.values(EmployeeStatus),
    default: EmployeeStatus.PENDING,
  })
  status: EmployeeStatus;

  @Prop({ type: Date, default: null })
  lastVerifiedAt: Date | null;

  @Prop({ type: Boolean, default: false })
  deletedAt: boolean;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

EmployeeSchema.index({ orgId: 1, status: 1 });
EmployeeSchema.index({ phone: 1 }, { unique: true, sparse: true });
