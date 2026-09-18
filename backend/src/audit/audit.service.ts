import { Injectable } from '@nestjs/common';
import { AuditAcao } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  log(params: {
    entidade: string;
    entidadeId?: string | null;
    acao: AuditAcao;
    usuarioId?: string | null;
    detalhes?: unknown;
  }) {
    return this.prisma.auditLog.create({
      data: {
        entidade: params.entidade,
        entidadeId: params.entidadeId ?? null,
        acao: params.acao,
        usuarioId: params.usuarioId ?? null,
        detalhes: params.detalhes === undefined ? undefined : (params.detalhes as never),
      },
    });
  }

  list(params: { entidade?: string; limit?: number }) {
    return this.prisma.auditLog.findMany({
      where: params.entidade ? { entidade: params.entidade } : undefined,
      include: { usuario: { select: { nome: true, email: true } } },
      orderBy: { criadoEm: 'desc' },
      take: params.limit ?? 200,
    });
  }
}
