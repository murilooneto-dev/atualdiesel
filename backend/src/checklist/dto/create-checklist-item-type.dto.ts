import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateChecklistItemTypeDto {
  @IsString()
  @MinLength(2)
  nome!: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
