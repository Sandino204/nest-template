import { ACCOUNT_TYPE } from '../entities/account.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateAccountDto {
  @ApiProperty()
  @IsEnum(ACCOUNT_TYPE)
  accountType: ACCOUNT_TYPE;
}
