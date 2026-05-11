import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true, collection: 'transactions' })
export class Transaction {
  @Prop({ required: true, type: String, unique: true })
  txId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Employee', index: true })
  employeeId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  orgId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: String })
  destination: string;

  @Prop({ required: true, type: Date, index: true })
  txTimestamp: Date;

  @Prop({ type: String, default: 'transfer' })
  txType: string;

  @Prop({ type: Boolean, default: false })
  isSuspicious: boolean;

  @Prop({ type: Boolean, default: false })
  velocityFlag: boolean;

  @Prop({ type: String, default: null })
  cycleId: string | null;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

TransactionSchema.index({ employeeId: 1, txTimestamp: -1 });
TransactionSchema.index({ orgId: 1, txTimestamp: -1 });
TransactionSchema.index({ destination: 1, orgId: 1 });
