import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export interface SalaryEntry {
  employeeId: Types.ObjectId;
  amount: number;
}

export type PayrollScheduleDocument = HydratedDocument<PayrollSchedule>;

@Schema({ timestamps: true, collection: 'payroll_schedules' })
export class PayrollSchedule {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', unique: true })
  orgId: Types.ObjectId;

  @Prop({ required: true, type: Number, min: 1, max: 28 })
  disbursementDay: number;

  @Prop({ required: true, type: Number, default: 24 })
  smsHoursBefore: number;

  @Prop({
    type: [{ employeeId: Types.ObjectId, amount: Number }],
    default: [],
  })
  salaryAmounts: SalaryEntry[];

  @Prop({ type: String, default: null })
  encryptedSquadApiKey: string | null;
}

export const PayrollScheduleSchema =
  SchemaFactory.createForClass(PayrollSchedule);

PayrollScheduleSchema.index({ orgId: 1 }, { unique: true });
