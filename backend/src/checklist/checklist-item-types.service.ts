import { Injectable, NotFoundException } from '@nestjs/common';
import type { Profile } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateChecklistItemTypeDto } from './dto/create-checklist-item-type.dto.js';
import { UpdateChecklistItemTypeDto } from './dto/update-checklist-item-type.dto.js';
import { AuditService } from '../audit/audit.service.js';

@Injectable()
export class ChecklistItemTypesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  list() {
    return this.prisma.checklistItemType.findMany({ orderBy: { nome: 'asc' } });
  }

  async get(id: string) {
    const item = await this.prisma.checklistItemType.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Tipo de item não encontrado.');
    return item;
  }

  async create(dto: CreateChecklistItemTypeDto, user: Profile) {
    const item = await this.prisma.checklistItemType.create({ data: dto });
    await this.audit.log({ entidade: 'ChecklistItemType', entidadeId: item.id, acao: 'CRIACAO', usuarioId: user.id, detalhes: dto });
    return item;
  }

  async update(id: string, dto: UpdateChecklistItemTypeDto, user: Profile) {
    await this.get(id);
    const item = await this.prisma.checklistItemType.update({ where: { id }, data: dto });
    await this.audit.log({ entidade: 'ChecklistItemType', entidadeId: id, acao: 'ATUALIZACAO', usuarioId: user.id, detalhes: dto });
    return item;
  }

  async remove(id: string, user: Profile) {
    await this.get(id);
    await this.prisma.checklistItemType.delete({ where: { id } });
    await this.audit.log({ entidade: 'ChecklistItemType', entidadeId: id, acao: 'EXCLUSAO', usuarioId: user.id });
  }
}
