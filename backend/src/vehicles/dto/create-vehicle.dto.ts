import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { Combustivel } from '@prisma/client';

export class CreateVehicleDto {
  @IsUUID()
  clientId!: string;

  @IsString()
  @MinLength(1)
  placa!: string;

  @IsString()
  @MinLength(1)
  marca!: string;

  @IsString()
  @MinLength(1)
  modelo!: string;

  @IsOptional()
  @IsInt()
  ano?: number;

  @IsOptional()
  @IsString()
  cor?: string;

  @IsOptional()
  @IsInt()
  quilometragemAtual?: number;

  @IsOptional()
  @IsEnum(Combustivel)
  combustivel?: Combustivel;

  @IsOptional()
  @IsString()
  chassi?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
