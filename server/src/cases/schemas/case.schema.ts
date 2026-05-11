import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CaseStatus } from '../../common/enums';

export type CaseDocument = HydratedDocument<Case>;

@Schema({ timestamps: true, collection: 'cases' })
export class Case {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Employee', index: true })
  employeeId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  orgId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  flaggedBy: Types.ObjectId;

  @Prop({ required: true, type: Date, default: Date.now })
  flaggedAt: Date;

  @Prop({
    type: String,
    enum: Object.values(CaseStatus),
    default: CaseStatus.OPEN,
  })
  status: CaseStatus;

  @Prop({ type: Date, default: null })
  resolvedAt: Date | null;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  resolvedBy: Types.ObjectId | null;

  @Prop({ type: String, default: null })
  notes: string | null;
}

export const CaseSchema = SchemaFactory.createForClass(Case);
CaseSchema.index({ orgId: 1, status: 1 });
CaseSchema.index({ employeeId: 1 }, { unique: true });
