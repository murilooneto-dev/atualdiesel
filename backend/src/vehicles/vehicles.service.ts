import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateVehicleDto } from './dto/create-vehicle.dto.js';
import { UpdateVehicleDto } from './dto/update-vehicle.dto.js';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

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

  create(dto: CreateVehicleDto) {
    return this.prisma.vehicle.create({ data: dto });
  }

  async update(id: string, dto: UpdateVehicleDto) {
    await this.get(id);
    return this.prisma.vehicle.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.get(id);
    await this.prisma.vehicle.delete({ where: { id } });
  }
}
