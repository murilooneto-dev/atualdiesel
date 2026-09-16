import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateChecklistItemTypeDto } from './dto/create-checklist-item-type.dto.js';
import { UpdateChecklistItemTypeDto } from './dto/update-checklist-item-type.dto.js';

@Injectable()
export class ChecklistItemTypesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.checklistItemType.findMany({ orderBy: { nome: 'asc' } });
  }

  async get(id: string) {
    const item = await this.prisma.checklistItemType.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Tipo de item não encontrado.');
    return item;
  }

  create(dto: CreateChecklistItemTypeDto) {
    return this.prisma.checklistItemType.create({ data: dto });
  }

  async update(id: string, dto: UpdateChecklistItemTypeDto) {
    await this.get(id);
    return this.prisma.checklistItemType.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.get(id);
    await this.prisma.checklistItemType.delete({ where: { id } });
  }
}
