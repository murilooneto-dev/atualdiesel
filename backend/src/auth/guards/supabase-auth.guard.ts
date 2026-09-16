import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../prisma/prisma.service.js';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator.js';
import { Reflector } from '@nestjs/core';

interface SupabaseJwtPayload {
  sub: string;
  email?: string;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não informado.');
    }

    const token = authHeader.slice('Bearer '.length);
    const secret = this.config.get<string>('SUPABASE_JWT_SECRET');
    if (!secret) {
      throw new UnauthorizedException('Configuração de autenticação ausente.');
    }

    let payload: SupabaseJwtPayload;
    try {
      payload = jwt.verify(token, secret, { algorithms: ['HS256'] }) as SupabaseJwtPayload;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    const profile = await this.prisma.profile.findUnique({ where: { id: payload.sub } });
    if (!profile || !profile.ativo) {
      throw new UnauthorizedException('Usuário sem acesso ao sistema.');
    }

    request.user = profile;
    return true;
  }
}
