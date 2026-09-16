import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ClientsService } from './clients.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  list(@Query('search') search?: string) {
    return this.clientsService.list(search);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.clientsService.get(id);
  }

  @Get(':id/vehicles')
  vehicles(@Param('id') id: string) {
    return this.clientsService.vehicles(id);
  }

  @Get(':id/service-orders')
  serviceOrders(@Param('id') id: string) {
    return this.clientsService.serviceOrders(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.GERENTE)
  create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.GERENTE)
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.GERENTE)
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
