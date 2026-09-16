import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { VehiclesService } from './vehicles.service.js';
import { CreateVehicleDto } from './dto/create-vehicle.dto.js';
import { UpdateVehicleDto } from './dto/update-vehicle.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  list(@Query('search') search?: string) {
    return this.vehiclesService.list(search);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.vehiclesService.get(id);
  }

  @Get(':id/service-orders')
  serviceOrders(@Param('id') id: string) {
    return this.vehiclesService.serviceOrders(id);
  }

  @Get(':id/checklists')
  checklists(@Param('id') id: string) {
    return this.vehiclesService.checklists(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.GERENTE)
  create(@Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.GERENTE)
  update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.GERENTE)
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}
