import { HydratedDocument, Types } from 'mongoose';
import { NodeType } from '../../common/enums';
export type GraphNodeDocument = HydratedDocument<GraphNode>;
export declare class GraphNode {
    orgId: Types.ObjectId;
    cycle: string;
    type: NodeType;
    label: string;
    accountNumber: string | null;
    employeeId: Types.ObjectId | null;
    totalInflow: number;
    totalOutflow: number;
}
export declare const GraphNodeSchema: import("mongoose").Schema<GraphNode, import("mongoose").Model<GraphNode, any, any, any, any, any, GraphNode>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, GraphNode, import("mongoose").Document<unknown, {}, GraphNode, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<GraphNode & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    orgId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, GraphNode, import("mongoose").Document<unknown, {}, GraphNode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GraphNode & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cycle?: import("mongoose").SchemaDefinitionProperty<string, GraphNode, import("mongoose").Document<unknown, {}, GraphNode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GraphNode & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<NodeType, GraphNode, import("mongoose").Document<unknown, {}, GraphNode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GraphNode & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    label?: import("mongoose").SchemaDefinitionProperty<string, GraphNode, import("mongoose").Document<unknown, {}, GraphNode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GraphNode & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    accountNumber?: import("mongoose").SchemaDefinitionProperty<string | null, GraphNode, import("mongoose").Document<unknown, {}, GraphNode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GraphNode & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    employeeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, GraphNode, import("mongoose").Document<unknown, {}, GraphNode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GraphNode & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalInflow?: import("mongoose").SchemaDefinitionProperty<number, GraphNode, import("mongoose").Document<unknown, {}, GraphNode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GraphNode & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalOutflow?: import("mongoose").SchemaDefinitionProperty<number, GraphNode, import("mongoose").Document<unknown, {}, GraphNode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<GraphNode & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, GraphNode>;
