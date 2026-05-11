import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@ApiTags('export')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.AUDITOR)
@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('case/:employeeId')
  @ApiOperation({ summary: 'Export employee case file as PDF' })
  @ApiResponse({ status: 200, description: 'PDF file download' })
  async exportCaseFile(
    @Param('employeeId') employeeId: string,
    @CurrentUser() user: JwtPayload,
    @Res() res: Response,
  ): Promise<void> {
    const pdfBuffer = await this.exportService.generateCaseFilePdf(
      employeeId,
      user.orgId,
    );

    const filename = `sage-case-${employeeId}-${Date.now()}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
