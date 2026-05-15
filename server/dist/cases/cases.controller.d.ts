import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { CaseStatus } from '../common/enums';
export declare class CasesController {
    private readonly casesService;
    constructor(casesService: CasesService);
    findAll(user: JwtPayload, status?: CaseStatus): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/case.schema").Case, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/case.schema").Case & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(dto: CreateCaseDto, user: JwtPayload): Promise<import("mongoose").Document<unknown, {}, import("./schemas/case.schema").Case, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/case.schema").Case & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    resolve(id: string, user: JwtPayload): Promise<import("mongoose").Document<unknown, {}, import("./schemas/case.schema").Case, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/case.schema").Case & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
}
