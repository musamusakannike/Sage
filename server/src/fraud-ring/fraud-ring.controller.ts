import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FraudRingService } from './fraud-ring.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums';

@ApiTags('fraud-ring')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.AUDITOR)
@Controller('fraud-ring')
export class FraudRingController {
  constructor(private readonly fraudRingService: FraudRingService) {}

  @Post('build')
  @ApiOperation({ summary: 'Trigger graph rebuild for current cycle (Auditor)' })
  buildGraph(@CurrentUser() user: JwtPayload, @Query('cycle') cycle?: string) {
    return this.fraudRingService.buildGraph(user.orgId, cycle);
  }

  @Get()
  @ApiOperation({ summary: 'Get fraud ring graph data for a cycle' })
  @ApiQuery({ name: 'cycle', required: false, example: '2026-05' })
  @ApiResponse({ status: 200, description: 'Graph nodes, edges, ring confidence' })
  getGraph(@CurrentUser() user: JwtPayload, @Query('cycle') cycle?: string) {
    return this.fraudRingService.getGraph(user.orgId, cycle);
  }

  @Get('node/:nodeId')
  @ApiOperation({ summary: 'Get detail for a single graph node' })
  @ApiResponse({ status: 200, description: 'Node detail with connected edges' })
  getNode(@Param('nodeId') nodeId: string, @CurrentUser() user: JwtPayload) {
    return this.fraudRingService.getNodeDetail(nodeId, user.orgId);
  }
}
