import { Module } from '@nestjs/common';
import { ServiceOrdersController } from './service-orders.controller.js';
import { ServiceOrdersService } from './service-orders.service.js';
import { PdfModule } from '../pdf/pdf.module.js';

@Module({
  imports: [PdfModule],
  controllers: [ServiceOrdersController],
  providers: [ServiceOrdersService],
})
export class ServiceOrdersModule {}
