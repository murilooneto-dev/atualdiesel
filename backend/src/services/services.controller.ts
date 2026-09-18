import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import type { Profile } from '@prisma/client';
import { ServicesService } from './services.service.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  list() {
    return this.servicesService.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.servicesService.get(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.GERENTE)
  create(@Body() dto: CreateServiceDto, @CurrentUser() user: Profile) {
    return this.servicesService.create(dto, user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.GERENTE)
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto, @CurrentUser() user: Profile) {
    return this.servicesService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.GERENTE)
  remove(@Param('id') id: string, @CurrentUser() user: Profile) {
    return this.servicesService.remove(id, user);
  }
}
