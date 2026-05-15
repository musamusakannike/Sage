import { HydratedDocument, Types } from 'mongoose';
export interface SalaryEntry {
    employeeId: Types.ObjectId;
    amount: number;
}
export type PayrollScheduleDocument = HydratedDocument<PayrollSchedule>;
export declare class PayrollSchedule {
    orgId: Types.ObjectId;
    disbursementDay: number;
    smsHoursBefore: number;
    salaryAmounts: SalaryEntry[];
    encryptedSquadApiKey: string | null;
}
export declare const PayrollScheduleSchema: import("mongoose").Schema<PayrollSchedule, import("mongoose").Model<PayrollSchedule, any, any, any, any, any, PayrollSchedule>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PayrollSchedule, import("mongoose").Document<unknown, {}, PayrollSchedule, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<PayrollSchedule & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    orgId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, PayrollSchedule, import("mongoose").Document<unknown, {}, PayrollSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PayrollSchedule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    disbursementDay?: import("mongoose").SchemaDefinitionProperty<number, PayrollSchedule, import("mongoose").Document<unknown, {}, PayrollSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PayrollSchedule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    smsHoursBefore?: import("mongoose").SchemaDefinitionProperty<number, PayrollSchedule, import("mongoose").Document<unknown, {}, PayrollSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PayrollSchedule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    salaryAmounts?: import("mongoose").SchemaDefinitionProperty<SalaryEntry[], PayrollSchedule, import("mongoose").Document<unknown, {}, PayrollSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PayrollSchedule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    encryptedSquadApiKey?: import("mongoose").SchemaDefinitionProperty<string | null, PayrollSchedule, import("mongoose").Document<unknown, {}, PayrollSchedule, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PayrollSchedule & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, PayrollSchedule>;
