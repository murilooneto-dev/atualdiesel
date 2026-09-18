import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller.js';
import { ServicesService } from './services.service.js';
import { AuditModule } from '../audit/audit.module.js';

@Module({
  imports: [AuditModule],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
