import { Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateServiceOrderDto } from './dto/create-service-order.dto.js';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto.js';
import { AddServiceOrderItemDto } from './dto/add-item.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';

const include = {
  client: true,
  vehicle: true,
  entryChecklist: true,
  itens: { include: { service: true } },
  statusHistorico: { orderBy: { alteradoEm: 'desc' as const } },
};

@Injectable()
export class ServiceOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  list(status?: string) {
    return this.prisma.serviceOrder.findMany({
      where: status ? { status: status as never } : undefined,
      include,
      orderBy: { dataAbertura: 'desc' },
    });
  }

  async get(id: string) {
    const os = await this.prisma.serviceOrder.findUnique({ where: { id }, include });
    if (!os) throw new NotFoundException('Ordem de serviço não encontrada.');
    return os;
  }

  create(dto: CreateServiceOrderDto, user: Profile) {
    return this.prisma.serviceOrder.create({
      data: {
        clientId: dto.clientId,
        vehicleId: dto.vehicleId,
        entryChecklistId: dto.entryChecklistId,
        dataPrevisao: dto.dataPrevisao ? new Date(dto.dataPrevisao) : undefined,
        observacoes: dto.observacoes,
        criadoPor: user.id,
      },
      include,
    });
  }

  async update(id: string, dto: UpdateServiceOrderDto) {
    await this.get(id);
    return this.prisma.serviceOrder.update({
      where: { id },
      data: {
        ...dto,
        dataPrevisao: dto.dataPrevisao ? new Date(dto.dataPrevisao) : undefined,
      },
      include,
    });
  }

  private async recalculateTotal(serviceOrderId: string) {
    const itens = await this.prisma.serviceOrderItem.findMany({ where: { serviceOrderId } });
    const total = itens.reduce((sum, item) => sum + Number(item.valorTotal), 0);
    await this.prisma.serviceOrder.update({ where: { id: serviceOrderId }, data: { valorTotal: total } });
  }

  async addItem(osId: string, dto: AddServiceOrderItemDto) {
    await this.get(osId);
    const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId } });
    if (!service) throw new NotFoundException('Serviço não encontrado.');

    await this.prisma.serviceOrderItem.create({
      data: {
        serviceOrderId: osId,
        serviceId: dto.serviceId,
        descricao: dto.descricao ?? service.nome,
        quantidade: dto.quantidade,
        valorUnitario: dto.valorUnitario,
        valorTotal: dto.quantidade * dto.valorUnitario,
      },
    });

    await this.recalculateTotal(osId);
    return this.get(osId);
  }

  async removeItem(osId: string, itemId: string) {
    await this.prisma.serviceOrderItem.delete({ where: { id: itemId } });
    await this.recalculateTotal(osId);
    return this.get(osId);
  }

  async updateStatus(osId: string, dto: UpdateStatusDto, user: Profile) {
    const os = await this.get(osId);

    await this.prisma.serviceOrderStatusHistory.create({
      data: {
        serviceOrderId: osId,
        statusAnterior: os.status,
        statusNovo: dto.status,
        alteradoPor: user.id,
        observacao: dto.observacao,
      },
    });

    return this.prisma.serviceOrder.update({
      where: { id: osId },
      data: { status: dto.status },
      include,
    });
  }

  async finalize(osId: string, user: Profile) {
    const os = await this.get(osId);

    await this.prisma.serviceOrderStatusHistory.create({
      data: {
        serviceOrderId: osId,
        statusAnterior: os.status,
        statusNovo: 'CONCLUIDA',
        alteradoPor: user.id,
        observacao: 'OS finalizada.',
      },
    });

    return this.prisma.serviceOrder.update({
      where: { id: osId },
      data: { status: 'CONCLUIDA', dataConclusao: new Date() },
      include,
    });
  }
}
