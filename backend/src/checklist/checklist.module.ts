import { Module } from '@nestjs/common';
import { ChecklistItemTypesController } from './checklist-item-types.controller.js';
import { ChecklistItemTypesService } from './checklist-item-types.service.js';
import { ChecklistsController } from './checklists.controller.js';
import { ChecklistsService } from './checklists.service.js';

@Module({
  controllers: [ChecklistItemTypesController, ChecklistsController],
  providers: [ChecklistItemTypesService, ChecklistsService],
})
export class ChecklistModule {}
