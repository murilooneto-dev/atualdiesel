import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { NivelCombustivel, StatusChecklistItem } from '@prisma/client';

class UpdateChecklistItemInputDto {
  @IsUUID()
  id!: string;

  @IsEnum(StatusChecklistItem)
  status!: StatusChecklistItem;

  @IsOptional()
  @IsString()
  observacao?: string;
}

export class UpdateChecklistDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  quilometragem?: number;

  @IsOptional()
  @IsEnum(NivelCombustivel)
  nivelCombustivel?: NivelCombustivel;

  @IsOptional()
  @IsString()
  observacoesGerais?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateChecklistItemInputDto)
  itens?: UpdateChecklistItemInputDto[];
}
