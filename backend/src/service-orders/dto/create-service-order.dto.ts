import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateServiceOrderDto {
  @IsUUID()
  clientId!: string;

  @IsUUID()
  vehicleId!: string;

  @IsOptional()
  @IsUUID()
  entryChecklistId?: string;

  @IsOptional()
  @IsDateString()
  dataPrevisao?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
