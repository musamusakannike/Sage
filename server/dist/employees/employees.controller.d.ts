import { EmployeesService } from './employees.service';
import { UpdateEmployeeStatusDto } from './dto/update-employee-status.dto';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { EmployeeStatus } from '../common/enums';
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    findAll(user: JwtPayload, status?: EmployeeStatus, search?: string, page?: string, limit?: string): Promise<{
        data: import("./schemas/employee.schema").EmployeeDocument[];
        total: number;
    }>;
    findOne(id: string, user: JwtPayload): Promise<import("mongoose").Document<unknown, {}, import("./schemas/employee.schema").Employee, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/employee.schema").Employee & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    hold(id: string, user: JwtPayload): Promise<import("mongoose").Document<unknown, {}, import("./schemas/employee.schema").Employee, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/employee.schema").Employee & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    freeze(id: string, _dto: UpdateEmployeeStatusDto, user: JwtPayload): Promise<import("mongoose").Document<unknown, {}, import("./schemas/employee.schema").Employee, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/employee.schema").Employee & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    importCsv(file: Express.Multer.File, user: JwtPayload): Promise<import("./employees.service").ImportResult>;
}
