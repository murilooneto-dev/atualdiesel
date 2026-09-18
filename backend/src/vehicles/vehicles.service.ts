import { Injectable, NotFoundException } from '@nestjs/common';
import type { Profile } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateVehicleDto } from './dto/create-vehicle.dto.js';
import { UpdateVehicleDto } from './dto/update-vehicle.dto.js';
import { AuditService } from '../audit/audit.service.js';

@Injectable()
export class VehiclesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  list(search?: string) {
    return this.prisma.vehicle.findMany({
      where: search
        ? {
            OR: [
              { placa: { contains: search, mode: 'insensitive' } },
              { marca: { contains: search, mode: 'insensitive' } },
              { modelo: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: { client: true },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async get(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id }, include: { client: true } });
    if (!vehicle) throw new NotFoundException('Veículo não encontrado.');
    return vehicle;
  }

  serviceOrders(id: string) {
    return this.prisma.serviceOrder.findMany({
      where: { vehicleId: id },
      orderBy: { dataAbertura: 'desc' },
      include: { itens: true },
    });
  }

  checklists(id: string) {
    return this.prisma.entryChecklist.findMany({
      where: { vehicleId: id },
      orderBy: { criadoEm: 'desc' },
      include: { itens: { include: { checklistItemType: true } }, fotos: true },
    });
  }

  async create(dto: CreateVehicleDto, user: Profile) {
    const vehicle = await this.prisma.vehicle.create({ data: dto });
    await this.audit.log({ entidade: 'Vehicle', entidadeId: vehicle.id, acao: 'CRIACAO', usuarioId: user.id, detalhes: dto });
    return vehicle;
  }

  async update(id: string, dto: UpdateVehicleDto, user: Profile) {
    await this.get(id);
    const vehicle = await this.prisma.vehicle.update({ where: { id }, data: dto });
    await this.audit.log({ entidade: 'Vehicle', entidadeId: id, acao: 'ATUALIZACAO', usuarioId: user.id, detalhes: dto });
    return vehicle;
  }

  async remove(id: string, user: Profile) {
    await this.get(id);
    await this.prisma.vehicle.delete({ where: { id } });
    await this.audit.log({ entidade: 'Vehicle', entidadeId: id, acao: 'EXCLUSAO', usuarioId: user.id });
  }
}
