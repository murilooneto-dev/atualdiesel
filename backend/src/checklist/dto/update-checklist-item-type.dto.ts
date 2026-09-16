import { PartialType } from '@nestjs/mapped-types';
import { CreateChecklistItemTypeDto } from './create-checklist-item-type.dto.js';

export class UpdateChecklistItemTypeDto extends PartialType(CreateChecklistItemTypeDto) {}
