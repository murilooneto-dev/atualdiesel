import { Module } from '@nestjs/common';
import { ChecklistItemTypesController } from './checklist-item-types.controller.js';
import { ChecklistItemTypesService } from './checklist-item-types.service.js';
import { ChecklistsController } from './checklists.controller.js';
import { ChecklistsService } from './checklists.service.js';
import { PdfModule } from '../pdf/pdf.module.js';
import { AuditModule } from '../audit/audit.module.js';

@Module({
  imports: [PdfModule, AuditModule],
  controllers: [ChecklistItemTypesController, ChecklistsController],
  providers: [ChecklistItemTypesService, ChecklistsService],
})
export class ChecklistModule {}
