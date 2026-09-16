import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { PrismaService } from '../../prisma/prisma.service.js';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator.js';
import { Reflector } from '@nestjs/core';

interface SupabaseJwtPayload {
  sub: string;
  email?: string;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly jwks: ReturnType<typeof jwksClient>;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {
    const supabaseUrl = this.config.getOrThrow<string>('SUPABASE_URL');
    this.jwks = jwksClient({
      jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
      cache: true,
      cacheMaxAge: 10 * 60 * 1000,
    });
  }

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
    const payload = await this.verifyToken(token);

    const profile = await this.prisma.profile.findUnique({ where: { id: payload.sub } });
    if (!profile || !profile.ativo) {
      throw new UnauthorizedException('Usuário sem acesso ao sistema.');
    }

    request.user = profile;
    return true;
  }

  private verifyToken(token: string): Promise<SupabaseJwtPayload> {
    return new Promise((resolve, reject) => {
      const decoded = jwt.decode(token, { complete: true });
      const kid = decoded?.header?.kid;
      const alg = decoded?.header?.alg;

      // Projetos Supabase legados assinam com HS256 usando o JWT Secret compartilhado.
      if (alg === 'HS256') {
        const secret = this.config.get<string>('SUPABASE_JWT_SECRET');
        if (!secret) {
          reject(new UnauthorizedException('Configuração de autenticação ausente.'));
          return;
        }
        jwt.verify(token, secret, { algorithms: ['HS256'] }, (err, payload) => {
          if (err || !payload) {
            reject(new UnauthorizedException('Token inválido ou expirado.'));
            return;
          }
          resolve(payload as SupabaseJwtPayload);
        });
        return;
      }

      // Projetos novos assinam com chaves assimétricas (ES256/RS256) via JWKS.
      this.jwks.getSigningKey(kid, (err, key) => {
        if (err || !key) {
          reject(new UnauthorizedException('Token inválido ou expirado.'));
          return;
        }
        jwt.verify(
          token,
          key.getPublicKey(),
          { algorithms: ['ES256', 'RS256'] },
          (verifyErr, payload) => {
            if (verifyErr || !payload) {
              reject(new UnauthorizedException('Token inválido ou expirado.'));
              return;
            }
            resolve(payload as SupabaseJwtPayload);
          },
        );
      });
    });
  }
}
