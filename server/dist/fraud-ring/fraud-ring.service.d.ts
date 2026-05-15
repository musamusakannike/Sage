import { Model, Types } from 'mongoose';
import { GraphNode, GraphNodeDocument } from './schemas/graph-node.schema';
import { GraphEdge, GraphEdgeDocument } from './schemas/graph-edge.schema';
import { RingConfidence } from '../common/enums';
import { TransactionsService } from '../transactions/transactions.service';
export interface GraphData {
    nodes: GraphNodeDocument[];
    edges: GraphEdgeDocument[];
    ringConfidence: RingConfidence;
    convergenceCount: number;
}
export declare class FraudRingService {
    private nodeModel;
    private edgeModel;
    private transactionsService;
    constructor(nodeModel: Model<GraphNodeDocument>, edgeModel: Model<GraphEdgeDocument>, transactionsService: TransactionsService);
    buildGraph(orgId: string, cycle?: string): Promise<void>;
    getGraph(orgId: string, cycle?: string): Promise<GraphData>;
    getNodeDetail(nodeId: string, orgId: string): Promise<{
        node: (import("mongoose").Document<unknown, {}, GraphNode, {}, import("mongoose").DefaultSchemaOptions> & GraphNode & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>) | null;
        edges: (import("mongoose").Document<unknown, {}, GraphEdge, {}, import("mongoose").DefaultSchemaOptions> & GraphEdge & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        totalInflow: number;
        totalOutflow: number;
    }>;
    private computeRingConfidence;
}
