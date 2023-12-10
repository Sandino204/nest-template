import { TRANSACTION_TYPE } from '../entities/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import TransformDate from '../../../transformers/date.transformer';

export class GetTransactionDto {
  @ApiProperty()
  @IsEnum(TRANSACTION_TYPE)
  @IsOptional()
  type?: TRANSACTION_TYPE;

  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  minValue?: number;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  maxValue?: number;
}
