import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { NodeType } from '../../common/enums';

export type GraphNodeDocument = HydratedDocument<GraphNode>;

@Schema({ timestamps: true, collection: 'graph_nodes' })
export class GraphNode {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  orgId: Types.ObjectId;

  @Prop({ required: true, type: String, index: true })
  cycle: string;

  @Prop({ required: true, type: String, enum: Object.values(NodeType) })
  type: NodeType;

  @Prop({ required: true, type: String })
  label: string;

  @Prop({ type: String, default: null })
  accountNumber: string | null;

  @Prop({ type: Types.ObjectId, ref: 'Employee', default: null })
  employeeId: Types.ObjectId | null;

  @Prop({ type: Number, default: 0 })
  totalInflow: number;

  @Prop({ type: Number, default: 0 })
  totalOutflow: number;
}

export const GraphNodeSchema = SchemaFactory.createForClass(GraphNode);
GraphNodeSchema.index({ orgId: 1, cycle: 1, accountNumber: 1 });
