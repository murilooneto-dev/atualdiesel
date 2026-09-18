import { Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateChecklistDto } from './dto/create-checklist.dto.js';
import { UpdateChecklistDto } from './dto/update-checklist.dto.js';
import { CreateChecklistPhotoDto } from './dto/create-checklist-photo.dto.js';
import { AuditService } from '../audit/audit.service.js';

@Injectable()
export class ChecklistsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  list(search?: string) {
    return this.prisma.entryChecklist.findMany({
      where: search ? { vehicle: { placa: { contains: search, mode: 'insensitive' } } } : undefined,
      include: { vehicle: true },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async get(id: string) {
    const checklist = await this.prisma.entryChecklist.findUnique({
      where: { id },
      include: { itens: { include: { checklistItemType: true } }, fotos: true, vehicle: true },
    });
    if (!checklist) throw new NotFoundException('Checklist não encontrado.');
    return checklist;
  }

  async create(dto: CreateChecklistDto, user: Profile) {
    const checklist = await this.prisma.entryChecklist.create({
      data: {
        vehicleId: dto.vehicleId,
        quilometragem: dto.quilometragem,
        nivelCombustivel: dto.nivelCombustivel,
        observacoesGerais: dto.observacoesGerais,
        criadoPor: user.id,
        itens: {
          create: dto.itens.map((item) => ({
            checklistItemTypeId: item.checklistItemTypeId,
            status: item.status,
            observacao: item.observacao,
          })),
        },
      },
      include: { itens: true, fotos: true },
    });
    await this.audit.log({ entidade: 'EntryChecklist', entidadeId: checklist.id, acao: 'CRIACAO', usuarioId: user.id });
    return checklist;
  }

  async update(id: string, dto: UpdateChecklistDto, user: Profile) {
    await this.get(id);

    await this.prisma.entryChecklist.update({
      where: { id },
      data: {
        quilometragem: dto.quilometragem,
        nivelCombustivel: dto.nivelCombustivel,
        observacoesGerais: dto.observacoesGerais,
        atualizadoEm: new Date(),
      },
    });

    if (dto.itens) {
      for (const item of dto.itens) {
        await this.prisma.entryChecklistItem.update({
          where: { id: item.id },
          data: { status: item.status, observacao: item.observacao },
        });
      }
    }

    await this.audit.log({ entidade: 'EntryChecklist', entidadeId: id, acao: 'ATUALIZACAO', usuarioId: user.id, detalhes: dto });
    return this.get(id);
  }

  async addPhoto(checklistId: string, dto: CreateChecklistPhotoDto) {
    await this.get(checklistId);
    return this.prisma.entryChecklistPhoto.create({
      data: {
        entryChecklistId: checklistId,
        urlStorage: dto.urlStorage,
        descricao: dto.descricao,
      },
    });
  }
}
