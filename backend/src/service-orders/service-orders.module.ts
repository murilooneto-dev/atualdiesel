import { Module } from '@nestjs/common';
import { ServiceOrdersController } from './service-orders.controller.js';
import { ServiceOrdersService } from './service-orders.service.js';
import { PdfModule } from '../pdf/pdf.module.js';
import { AuditModule } from '../audit/audit.module.js';

@Module({
  imports: [PdfModule, AuditModule],
  controllers: [ServiceOrdersController],
  providers: [ServiceOrdersService],
})
export class ServiceOrdersModule {}
