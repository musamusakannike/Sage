import { HydratedDocument, Types } from 'mongoose';
export type VerificationSessionDocument = HydratedDocument<VerificationSession>;
export declare class VerificationSession {
    employeeId: Types.ObjectId;
    orgId: Types.ObjectId;
    token: string;
    tokenExpiresAt: Date;
    isConsumed: boolean;
    challengeCode: string;
    deviceFingerprint: string | null;
    gpsLat: number | null;
    gpsLng: number | null;
    gpsCaptured: boolean;
    livenessPasssed: boolean | null;
    scoreLiveness: number | null;
    scoreGeoCluster: number | null;
    scoreDevice: number | null;
    scoreTimeCluster: number | null;
    scorePayVelocity: number | null;
    ruleBasedDnaScore: number | null;
    geminiRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | null;
    geminiReason: string | null;
    geminiAdjustedScore: number | null;
    geminiAnomalyFlags: string[] | null;
    totalDnaScore: number | null;
    verifiedAt: Date | null;
    cycleId: string | null;
    attemptCount: number;
}
export declare const VerificationSessionSchema: import("mongoose").Schema<VerificationSession, import("mongoose").Model<VerificationSession, any, any, any, any, any, VerificationSession>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    employeeId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    orgId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    token?: import("mongoose").SchemaDefinitionProperty<string, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tokenExpiresAt?: import("mongoose").SchemaDefinitionProperty<Date, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isConsumed?: import("mongoose").SchemaDefinitionProperty<boolean, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    challengeCode?: import("mongoose").SchemaDefinitionProperty<string, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deviceFingerprint?: import("mongoose").SchemaDefinitionProperty<string | null, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gpsLat?: import("mongoose").SchemaDefinitionProperty<number | null, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gpsLng?: import("mongoose").SchemaDefinitionProperty<number | null, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gpsCaptured?: import("mongoose").SchemaDefinitionProperty<boolean, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    livenessPasssed?: import("mongoose").SchemaDefinitionProperty<boolean | null, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    scoreLiveness?: import("mongoose").SchemaDefinitionProperty<number | null, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    scoreGeoCluster?: import("mongoose").SchemaDefinitionProperty<number | null, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    scoreDevice?: import("mongoose").SchemaDefinitionProperty<number | null, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    scoreTimeCluster?: import("mongoose").SchemaDefinitionProperty<number | null, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    scorePayVelocity?: import("mongoose").SchemaDefinitionProperty<number | null, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    ruleBasedDnaScore?: import("mongoose").SchemaDefinitionProperty<number | null, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    geminiRiskLevel?: import("mongoose").SchemaDefinitionProperty<"LOW" | "MEDIUM" | "HIGH" | null, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    geminiReason?: import("mongoose").SchemaDefinitionProperty<string | null, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    geminiAdjustedScore?: import("mongoose").SchemaDefinitionProperty<number | null, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    geminiAnomalyFlags?: import("mongoose").SchemaDefinitionProperty<string[] | null, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalDnaScore?: import("mongoose").SchemaDefinitionProperty<number | null, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    verifiedAt?: import("mongoose").SchemaDefinitionProperty<Date | null, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cycleId?: import("mongoose").SchemaDefinitionProperty<string | null, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    attemptCount?: import("mongoose").SchemaDefinitionProperty<number, VerificationSession, import("mongoose").Document<unknown, {}, VerificationSession, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<VerificationSession & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, VerificationSession>;
