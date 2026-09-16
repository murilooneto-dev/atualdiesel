import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  list(search?: string) {
    return this.prisma.client.findMany({
      where: search
        ? {
            OR: [
              { nome: { contains: search, mode: 'insensitive' } },
              { cpfCnpj: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { nome: 'asc' },
    });
  }

  async get(id: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) throw new NotFoundException('Cliente não encontrado.');
    return client;
  }

  vehicles(id: string) {
    return this.prisma.vehicle.findMany({ where: { clientId: id }, orderBy: { criadoEm: 'desc' } });
  }

  serviceOrders(id: string) {
    return this.prisma.serviceOrder.findMany({
      where: { clientId: id },
      orderBy: { dataAbertura: 'desc' },
      include: { itens: true },
    });
  }

  create(dto: CreateClientDto) {
    return this.prisma.client.create({ data: dto });
  }

  async update(id: string, dto: UpdateClientDto) {
    await this.get(id);
    return this.prisma.client.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.get(id);
    await this.prisma.client.delete({ where: { id } });
  }
}
