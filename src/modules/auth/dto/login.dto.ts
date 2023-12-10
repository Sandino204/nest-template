import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  document: string;

  @ApiProperty()
  @IsString()
  password: string;
}
