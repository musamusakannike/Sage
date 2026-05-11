import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { UserRole, CaseStatus } from '../common/enums';

@ApiTags('cases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.AUDITOR)
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  @ApiOperation({ summary: 'List all active investigation cases' })
  @ApiQuery({ name: 'status', enum: CaseStatus, required: false })
  @ApiResponse({ status: 200, description: 'Cases list' })
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: CaseStatus,
  ) {
    return this.casesService.findAll(user.orgId, status);
  }

  @Post()
  @ApiOperation({ summary: 'Flag an employee for investigation' })
  @ApiResponse({ status: 201, description: 'Case created' })
  @ApiResponse({ status: 409, description: 'Open case already exists' })
  create(@Body() dto: CreateCaseDto, @CurrentUser() user: JwtPayload) {
    return this.casesService.create(user.orgId, dto, user.sub);
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Mark a case as resolved' })
  @ApiResponse({ status: 200, description: 'Case resolved' })
  resolve(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.casesService.resolve(id, user.orgId, user.sub);
  }
}
