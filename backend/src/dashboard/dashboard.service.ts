import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalClientes, totalVeiculos, osAbertas, osFinalizadasMes, faturamento] = await Promise.all([
      this.prisma.client.count({ where: { ativo: true } }),
      this.prisma.vehicle.count({ where: { ativo: true } }),
      this.prisma.serviceOrder.count({
        where: { status: { notIn: ['CONCLUIDA', 'CANCELADA'] } },
      }),
      this.prisma.serviceOrder.count({
        where: { status: 'CONCLUIDA', dataConclusao: { gte: startOfMonth } },
      }),
      this.prisma.serviceOrder.aggregate({
        where: { status: 'CONCLUIDA', dataConclusao: { gte: startOfMonth } },
        _sum: { valorTotal: true },
      }),
    ]);

    return {
      totalClientes,
      totalVeiculos,
      osAbertas,
      osFinalizadasMes,
      faturamentoMes: Number(faturamento._sum.valorTotal ?? 0),
    };
  }

  async serviceOrdersByStatus() {
    const grouped = await this.prisma.serviceOrder.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
    return grouped.map((g) => ({ status: g.status, quantidade: g._count._all }));
  }

  async revenueByPeriod() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const orders = await this.prisma.serviceOrder.findMany({
      where: { status: 'CONCLUIDA', dataConclusao: { gte: sixMonthsAgo } },
      select: { dataConclusao: true, valorTotal: true },
    });

    const byMonth = new Map<string, number>();
    for (const order of orders) {
      if (!order.dataConclusao) continue;
      const key = `${order.dataConclusao.getFullYear()}-${String(order.dataConclusao.getMonth() + 1).padStart(2, '0')}`;
      byMonth.set(key, (byMonth.get(key) ?? 0) + Number(order.valorTotal));
    }

    return Array.from(byMonth.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([periodo, total]) => ({ periodo, total }));
  }
}
