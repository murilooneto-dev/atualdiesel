import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SupabaseAdminService } from './supabase-admin.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseAdmin: SupabaseAdminService,
  ) {}

  list() {
    return this.prisma.profile.findMany({ orderBy: { nome: 'asc' } });
  }

  async get(id: string) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException('Usuário não encontrado.');
    return profile;
  }

  async create(dto: CreateUserDto) {
    const { data, error } = await this.supabaseAdmin.client.auth.admin.createUser({
      email: dto.email,
      password: dto.senha,
      email_confirm: true,
    });

    if (error || !data.user) {
      throw new BadRequestException(error?.message ?? 'Não foi possível criar o usuário.');
    }

    return this.prisma.profile.create({
      data: {
        id: data.user.id,
        nome: dto.nome,
        email: dto.email,
        papel: dto.papel,
        ativo: dto.ativo ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.get(id);
    return this.prisma.profile.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.get(id);
    await this.supabaseAdmin.client.auth.admin.deleteUser(id);
    await this.prisma.profile.delete({ where: { id } });
  }
}
