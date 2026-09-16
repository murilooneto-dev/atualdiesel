import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { NivelCombustivel, StatusChecklistItem } from '@prisma/client';

class ChecklistItemInputDto {
  @IsUUID()
  checklistItemTypeId!: string;

  @IsEnum(StatusChecklistItem)
  status!: StatusChecklistItem;

  @IsOptional()
  @IsString()
  observacao?: string;
}

export class CreateChecklistDto {
  @IsUUID()
  vehicleId!: string;

  @IsInt()
  @Min(0)
  quilometragem!: number;

  @IsEnum(NivelCombustivel)
  nivelCombustivel!: NivelCombustivel;

  @IsOptional()
  @IsString()
  observacoesGerais?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemInputDto)
  itens!: ChecklistItemInputDto[];
}
