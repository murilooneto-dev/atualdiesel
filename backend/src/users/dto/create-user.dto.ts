import { IsBoolean, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  nome!: string;

  @IsString()
  @MinLength(6)
  senha!: string;

  @IsEnum(Role)
  papel!: Role;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
