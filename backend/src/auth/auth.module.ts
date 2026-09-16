import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';

@Module({
  providers: [
    SupabaseAuthGuard,
    { provide: APP_GUARD, useClass: SupabaseAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}
