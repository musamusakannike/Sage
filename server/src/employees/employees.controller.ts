import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { UpdateEmployeeStatusDto } from './dto/update-employee-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { UserRole, EmployeeStatus } from '../common/enums';

@ApiTags('employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.HR_ADMIN)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get('me')
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get the employee record for the currently authenticated employee' })
  @ApiResponse({ status: 200, description: 'Employee record' })
  @ApiResponse({ status: 404, description: 'Employee record not found' })
  async getMe(@CurrentUser() user: JwtPayload) {
    const employee = await this.employeesService.findByEmail(user.email);
    if (!employee) throw new NotFoundException('Employee record not found.');
    return employee;
  }

  @Get()
  @ApiOperation({ summary: 'List all employees with optional filter and search' })
  @ApiQuery({ name: 'status', enum: EmployeeStatus, required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated employee list' })
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: EmployeeStatus,
    @Query('search') search?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.employeesService.findAll(
      user.orgId,
      status,
      search,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single employee by ID' })
  @ApiResponse({ status: 200, description: 'Employee detail' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.employeesService.findById(id, user.orgId);
  }

  @Patch(':id/hold')
  @ApiOperation({ summary: 'Hold an employee payment — sets status to PENDING' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  hold(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.employeesService.updateStatus(
      id,
      user.orgId,
      EmployeeStatus.PENDING,
    );
  }

  @Patch(':id/freeze')
  @ApiOperation({ summary: 'Freeze an employee payment — sets status to FROZEN' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  freeze(
    @Param('id') id: string,
    @Body() _dto: UpdateEmployeeStatusDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.employeesService.updateStatus(
      id,
      user.orgId,
      EmployeeStatus.FROZEN,
    );
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Import employee roster from CSV file' })
  @ApiResponse({ status: 201, description: 'Import result with counts' })
  async importCsv(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.employeesService.importFromCsv(user.orgId, file.buffer);
  }
}
