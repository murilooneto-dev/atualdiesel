import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import type { Profile } from '@prisma/client';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: Profile) {
    return user;
  }

  @Get()
  @Roles(Role.ADMIN)
  list() {
    return this.usersService.list();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  get(@Param('id') id: string) {
    return this.usersService.get(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateUserDto, @CurrentUser() user: Profile) {
    return this.usersService.create(dto, user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser() user: Profile) {
    return this.usersService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: Profile) {
    return this.usersService.remove(id, user);
  }
}
