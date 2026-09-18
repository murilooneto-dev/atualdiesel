import { Injectable, NotFoundException } from '@nestjs/common';
import type { Profile } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';
import { AuditService } from '../audit/audit.service.js';

@Injectable()
export class ClientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

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

  async create(dto: CreateClientDto, user: Profile) {
    const client = await this.prisma.client.create({ data: dto });
    await this.audit.log({ entidade: 'Client', entidadeId: client.id, acao: 'CRIACAO', usuarioId: user.id, detalhes: dto });
    return client;
  }

  async update(id: string, dto: UpdateClientDto, user: Profile) {
    await this.get(id);
    const client = await this.prisma.client.update({ where: { id }, data: dto });
    await this.audit.log({ entidade: 'Client', entidadeId: id, acao: 'ATUALIZACAO', usuarioId: user.id, detalhes: dto });
    return client;
  }

  async remove(id: string, user: Profile) {
    await this.get(id);
    await this.prisma.client.delete({ where: { id } });
    await this.audit.log({ entidade: 'Client', entidadeId: id, acao: 'EXCLUSAO', usuarioId: user.id });
  }
}
