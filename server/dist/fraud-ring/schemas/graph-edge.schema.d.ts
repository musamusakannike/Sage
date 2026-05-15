import { HydratedDocument, Types } from 'mongoose';
export type GraphEdgeDocument = HydratedDocument<GraphEdge>;
export declare class GraphEdge {
    orgId: Types.ObjectId;
    cycle: string;
    sourceNodeId: Types.ObjectId;
    targetNodeId: Types.ObjectId;
    amount: number;
    timestamp: Date;
}
export declare const GraphEdgeSchema: import("mongoose").Schema<GraphEdge, import("mongoose").Model<GraphEdge, any, any, any, any, any, GraphEdge>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, GraphEdge, import("mongoose").Document<unknown, {}, GraphEdge, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<GraphEdge & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    orgId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, GraphEdge, import("mongoose").Document<unknown, {}, GraphEdge, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GraphEdge & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cycle?: import("mongoose").SchemaDefinitionProperty<string, GraphEdge, import("mongoose").Document<unknown, {}, GraphEdge, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GraphEdge & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sourceNodeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, GraphEdge, import("mongoose").Document<unknown, {}, GraphEdge, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GraphEdge & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    targetNodeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, GraphEdge, import("mongoose").Document<unknown, {}, GraphEdge, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GraphEdge & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, GraphEdge, import("mongoose").Document<unknown, {}, GraphEdge, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GraphEdge & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    timestamp?: import("mongoose").SchemaDefinitionProperty<Date, GraphEdge, import("mongoose").Document<unknown, {}, GraphEdge, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GraphEdge & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, GraphEdge>;
