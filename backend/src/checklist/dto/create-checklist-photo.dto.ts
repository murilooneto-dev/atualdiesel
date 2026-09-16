import { IsOptional, IsString } from 'class-validator';

export class CreateChecklistPhotoDto {
  @IsString()
  urlStorage!: string;

  @IsOptional()
  @IsString()
  descricao?: string;
}
