import { TRANSACTION_TYPE } from '../entities/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty()
  @IsEnum(TRANSACTION_TYPE)
  type: TRANSACTION_TYPE;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;
}
