import { Body, Controller, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { Profile } from '@prisma/client';
import { ChecklistsService } from './checklists.service.js';
import { CreateChecklistDto } from './dto/create-checklist.dto.js';
import { UpdateChecklistDto } from './dto/update-checklist.dto.js';
import { CreateChecklistPhotoDto } from './dto/create-checklist-photo.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { PdfService } from '../pdf/pdf.service.js';

@Controller('checklists')
export class ChecklistsController {
  constructor(
    private readonly checklistsService: ChecklistsService,
    private readonly pdfService: PdfService,
  ) {}

  @Get()
  list(@Query('search') search?: string) {
    return this.checklistsService.list(search);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.checklistsService.get(id);
  }

  @Get(':id/pdf')
  async pdf(@Param('id') id: string, @Res() res: Response) {
    const checklist = await this.checklistsService.get(id);
    const stream = await this.pdfService.generateChecklistPdf(checklist);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="checklist-${checklist.id}.pdf"`);
    stream.pipe(res);
  }

  @Post()
  create(@Body() dto: CreateChecklistDto, @CurrentUser() user: Profile) {
    return this.checklistsService.create(dto, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChecklistDto, @CurrentUser() user: Profile) {
    return this.checklistsService.update(id, dto, user);
  }

  @Post(':id/photos')
  addPhoto(@Param('id') id: string, @Body() dto: CreateChecklistPhotoDto) {
    return this.checklistsService.addPhoto(id, dto);
  }
}
