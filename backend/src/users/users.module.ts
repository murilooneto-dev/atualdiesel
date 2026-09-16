import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { SupabaseAdminService } from './supabase-admin.service.js';

@Module({
  controllers: [UsersController],
  providers: [UsersService, SupabaseAdminService],
  exports: [SupabaseAdminService],
})
export class UsersModule {}
