import { HydratedDocument, Types } from 'mongoose';
import { EmployeeStatus } from '../../common/enums';
export type EmployeeDocument = HydratedDocument<Employee>;
export declare class Employee {
    orgId: Types.ObjectId;
    name: string;
    roleTitle: string;
    accountNumber: string;
    phone: string;
    email: string | null;
    dnaScore: number | null;
    status: EmployeeStatus;
    lastVerifiedAt: Date | null;
    deletedAt: boolean;
}
export declare const EmployeeSchema: import("mongoose").Schema<Employee, import("mongoose").Model<Employee, any, any, any, any, any, Employee>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Employee, import("mongoose").Document<unknown, {}, Employee, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    orgId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    roleTitle?: import("mongoose").SchemaDefinitionProperty<string, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    accountNumber?: import("mongoose").SchemaDefinitionProperty<string, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string | null, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dnaScore?: import("mongoose").SchemaDefinitionProperty<number | null, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<EmployeeStatus, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastVerifiedAt?: import("mongoose").SchemaDefinitionProperty<Date | null, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deletedAt?: import("mongoose").SchemaDefinitionProperty<boolean, Employee, import("mongoose").Document<unknown, {}, Employee, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Employee & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Employee>;
