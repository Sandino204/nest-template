import { ACCOUNT_TYPE } from '../entities/account.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty()
  @IsEnum(ACCOUNT_TYPE)
  accountType: ACCOUNT_TYPE;
}
