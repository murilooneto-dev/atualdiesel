import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller.js';
import { VehiclesService } from './vehicles.service.js';
import { AuditModule } from '../audit/audit.module.js';

@Module({
  imports: [AuditModule],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}
