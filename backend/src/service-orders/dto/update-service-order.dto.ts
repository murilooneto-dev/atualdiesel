import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceOrderDto } from './create-service-order.dto.js';

export class UpdateServiceOrderDto extends PartialType(CreateServiceOrderDto) {}
