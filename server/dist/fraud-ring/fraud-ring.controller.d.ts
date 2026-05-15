import { FraudRingService } from './fraud-ring.service';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
export declare class FraudRingController {
    private readonly fraudRingService;
    constructor(fraudRingService: FraudRingService);
    buildGraph(user: JwtPayload, cycle?: string): Promise<void>;
    getGraph(user: JwtPayload, cycle?: string): Promise<import("./fraud-ring.service").GraphData>;
    getNode(nodeId: string, user: JwtPayload): Promise<{
        node: (import("mongoose").Document<unknown, {}, import("./schemas/graph-node.schema").GraphNode, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/graph-node.schema").GraphNode & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>) | null;
        edges: (import("mongoose").Document<unknown, {}, import("./schemas/graph-edge.schema").GraphEdge, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/graph-edge.schema").GraphEdge & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        totalInflow: number;
        totalOutflow: number;
    }>;
}
