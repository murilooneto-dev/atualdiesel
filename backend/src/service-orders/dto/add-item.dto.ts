import { IsInt, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class AddServiceOrderItemDto {
  @IsUUID()
  serviceId!: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsInt()
  @Min(1)
  quantidade!: number;

  @IsNumber()
  @Min(0)
  valorUnitario!: number;
}
