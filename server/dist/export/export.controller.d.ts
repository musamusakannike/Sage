import type { Response } from 'express';
import { ExportService } from './export.service';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
export declare class ExportController {
    private readonly exportService;
    constructor(exportService: ExportService);
    exportCaseFile(employeeId: string, user: JwtPayload, res: Response): Promise<void>;
}
