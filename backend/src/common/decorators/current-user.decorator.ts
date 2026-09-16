import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Profile } from '@prisma/client';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): Profile => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
