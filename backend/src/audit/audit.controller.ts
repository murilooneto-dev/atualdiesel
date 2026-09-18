import { Controller, Get, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuditService } from './audit.service.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('audit-logs')
@Roles(Role.ADMIN)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  list(@Query('entidade') entidade?: string, @Query('limit') limit?: string) {
    return this.auditService.list({ entidade, limit: limit ? Number(limit) : undefined });
  }
}
