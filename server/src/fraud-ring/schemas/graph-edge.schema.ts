import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GraphEdgeDocument = HydratedDocument<GraphEdge>;

@Schema({ timestamps: true, collection: 'graph_edges' })
export class GraphEdge {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  orgId: Types.ObjectId;

  @Prop({ required: true, type: String, index: true })
  cycle: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'GraphNode' })
  sourceNodeId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'GraphNode' })
  targetNodeId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: Date })
  timestamp: Date;
}

export const GraphEdgeSchema = SchemaFactory.createForClass(GraphEdge);
GraphEdgeSchema.index({ orgId: 1, cycle: 1 });
