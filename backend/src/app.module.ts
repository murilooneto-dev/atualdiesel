import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ClientsModule } from './clients/clients.module.js';
import { VehiclesModule } from './vehicles/vehicles.module.js';
import { ServicesModule } from './services/services.module.js';
import { ChecklistModule } from './checklist/checklist.module.js';
import { ServiceOrdersModule } from './service-orders/service-orders.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { PdfModule } from './pdf/pdf.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    VehiclesModule,
    ServicesModule,
    ChecklistModule,
    ServiceOrdersModule,
    DashboardModule,
    PdfModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
