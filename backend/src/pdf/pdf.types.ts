import { Prisma } from '@prisma/client';

export type ServiceOrderWithRelations = Prisma.ServiceOrderGetPayload<{
  include: { client: true; vehicle: true; itens: { include: { service: true } } };
}>;
