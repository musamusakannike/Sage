import { HydratedDocument, Types } from 'mongoose';
import { CaseStatus } from '../../common/enums';
export type CaseDocument = HydratedDocument<Case>;
export declare class Case {
    employeeId: Types.ObjectId;
    orgId: Types.ObjectId;
    flaggedBy: Types.ObjectId;
    flaggedAt: Date;
    status: CaseStatus;
    resolvedAt: Date | null;
    resolvedBy: Types.ObjectId | null;
    notes: string | null;
}
export declare const CaseSchema: import("mongoose").Schema<Case, import("mongoose").Model<Case, any, any, any, any, any, Case>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Case, import("mongoose").Document<unknown, {}, Case, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Case & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    employeeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Case, import("mongoose").Document<unknown, {}, Case, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Case & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    orgId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Case, import("mongoose").Document<unknown, {}, Case, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Case & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    flaggedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Case, import("mongoose").Document<unknown, {}, Case, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Case & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    flaggedAt?: import("mongoose").SchemaDefinitionProperty<Date, Case, import("mongoose").Document<unknown, {}, Case, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Case & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<CaseStatus, Case, import("mongoose").Document<unknown, {}, Case, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Case & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    resolvedAt?: import("mongoose").SchemaDefinitionProperty<Date | null, Case, import("mongoose").Document<unknown, {}, Case, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Case & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    resolvedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null, Case, import("mongoose").Document<unknown, {}, Case, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Case & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string | null, Case, import("mongoose").Document<unknown, {}, Case, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Case & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Case>;
