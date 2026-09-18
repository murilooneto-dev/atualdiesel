import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { Role } from '@prisma/client';
import type { Profile } from '@prisma/client';
import { ServiceOrdersService } from './service-orders.service.js';
import { CreateServiceOrderDto } from './dto/create-service-order.dto.js';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto.js';
import { AddServiceOrderItemDto } from './dto/add-item.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { PdfService } from '../pdf/pdf.service.js';

@Controller('service-orders')
export class ServiceOrdersController {
  constructor(
    private readonly serviceOrdersService: ServiceOrdersService,
    private readonly pdfService: PdfService,
  ) {}

  @Get()
  list(@Query('status') status?: string) {
    return this.serviceOrdersService.list(status);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.serviceOrdersService.get(id);
  }

  @Get(':id/pdf')
  async pdf(@Param('id') id: string, @Res() res: Response) {
    const os = await this.serviceOrdersService.get(id);
    const stream = await this.pdfService.generateServiceOrderPdf(os);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="os-${os.numeroOs}.pdf"`);
    stream.pipe(res);
  }

  @Get(':id/receipt')
  async receipt(@Param('id') id: string, @Res() res: Response) {
    const os = await this.serviceOrdersService.getForReceipt(id);
    const stream = await this.pdfService.generateServiceOrderReceiptPdf(os);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="recibo-os-${os.numeroOs}.pdf"`);
    stream.pipe(res);
  }

  @Post()
  create(@Body() dto: CreateServiceOrderDto, @CurrentUser() user: Profile) {
    return this.serviceOrdersService.create(dto, user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.GERENTE)
  update(@Param('id') id: string, @Body() dto: UpdateServiceOrderDto, @CurrentUser() user: Profile) {
    return this.serviceOrdersService.update(id, dto, user);
  }

  @Post(':id/items')
  addItem(@Param('id') id: string, @Body() dto: AddServiceOrderItemDto, @CurrentUser() user: Profile) {
    return this.serviceOrdersService.addItem(id, dto, user);
  }

  @Delete(':id/items/:itemId')
  removeItem(@Param('id') id: string, @Param('itemId') itemId: string, @CurrentUser() user: Profile) {
    return this.serviceOrdersService.removeItem(id, itemId, user);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto, @CurrentUser() user: Profile) {
    return this.serviceOrdersService.updateStatus(id, dto, user);
  }

  @Post(':id/finalize')
  @Roles(Role.ADMIN, Role.GERENTE)
  finalize(@Param('id') id: string, @CurrentUser() user: Profile) {
    return this.serviceOrdersService.finalize(id, user);
  }
}
