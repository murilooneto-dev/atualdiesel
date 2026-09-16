import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ChecklistItemTypesService } from './checklist-item-types.service.js';
import { CreateChecklistItemTypeDto } from './dto/create-checklist-item-type.dto.js';
import { UpdateChecklistItemTypeDto } from './dto/update-checklist-item-type.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('checklist-item-types')
export class ChecklistItemTypesController {
  constructor(private readonly service: ChecklistItemTypesService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateChecklistItemTypeDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateChecklistItemTypeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
