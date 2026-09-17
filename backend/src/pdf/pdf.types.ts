import { Prisma } from '@prisma/client';

export type ServiceOrderWithRelations = Prisma.ServiceOrderGetPayload<{
  include: { client: true; vehicle: true; itens: { include: { service: true } } };
}>;

export type EntryChecklistWithRelations = Prisma.EntryChecklistGetPayload<{
  include: { vehicle: true; itens: { include: { checklistItemType: true } }; fotos: true };
}>;
