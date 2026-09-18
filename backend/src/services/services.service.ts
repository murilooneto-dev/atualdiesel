import { Injectable, NotFoundException } from '@nestjs/common';
import type { Profile } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';
import { AuditService } from '../audit/audit.service.js';

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  list() {
    return this.prisma.service.findMany({ orderBy: { nome: 'asc' } });
  }

  async get(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('Serviço não encontrado.');
    return service;
  }

  async create(dto: CreateServiceDto, user: Profile) {
    const service = await this.prisma.service.create({ data: dto });
    await this.audit.log({ entidade: 'Service', entidadeId: service.id, acao: 'CRIACAO', usuarioId: user.id, detalhes: dto });
    return service;
  }

  async update(id: string, dto: UpdateServiceDto, user: Profile) {
    await this.get(id);
    const service = await this.prisma.service.update({ where: { id }, data: dto });
    await this.audit.log({ entidade: 'Service', entidadeId: id, acao: 'ATUALIZACAO', usuarioId: user.id, detalhes: dto });
    return service;
  }

  async remove(id: string, user: Profile) {
    await this.get(id);
    await this.prisma.service.delete({ where: { id } });
    await this.audit.log({ entidade: 'Service', entidadeId: id, acao: 'EXCLUSAO', usuarioId: user.id });
  }
}
