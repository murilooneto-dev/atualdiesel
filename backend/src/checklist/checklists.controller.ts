import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { Profile } from '@prisma/client';
import { ChecklistsService } from './checklists.service.js';
import { CreateChecklistDto } from './dto/create-checklist.dto.js';
import { CreateChecklistPhotoDto } from './dto/create-checklist-photo.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('checklists')
export class ChecklistsController {
  constructor(private readonly checklistsService: ChecklistsService) {}

  @Get(':id')
  get(@Param('id') id: string) {
    return this.checklistsService.get(id);
  }

  @Post()
  create(@Body() dto: CreateChecklistDto, @CurrentUser() user: Profile) {
    return this.checklistsService.create(dto, user);
  }

  @Post(':id/photos')
  addPhoto(@Param('id') id: string, @Body() dto: CreateChecklistPhotoDto) {
    return this.checklistsService.addPhoto(id, dto);
  }
}
