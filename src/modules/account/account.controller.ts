import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { User } from '../../decorators/user.decorator';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Account } from './entities/account.entity';
import { DefaultResponse } from './response/default.response';

@Controller('account')
@UseGuards(AuthGuard)
@ApiTags('Account')
@ApiBearerAuth()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('/me')
  @ApiResponse({
    type: Account,
    status: 200,
    isArray: true,
  })
  async getMyAccounts(@User() userId: string) {
    return await this.accountService.getMyAccounts(userId);
  }
  @Get('/:number')
  @ApiResponse({
    type: Account,
    status: 200,
    isArray: true,
  })
  async getMyAccount(
    @User() userId: string,
    @Param('number') accountNumber: string,
  ) {
    return await this.accountService.getMyAccount(userId, accountNumber);
  }

  @Post('/')
  @ApiResponse({
    type: Account,
    status: 200,
  })
  async create(@User() userId: string, @Body() payload: CreateAccountDto) {
    return await this.accountService.createAccount(userId, payload);
  }

  @Patch('/:number')
  @ApiResponse({
    type: Account,
    status: 200,
  })
  async update(
    @User() userId: string,
    @Param('number') accountNumber: string,
    @Body() payload: UpdateAccountDto,
  ) {
    return await this.accountService.updateAccount(
      userId,
      accountNumber,
      payload,
    );
  }

  @Delete('/:number')
  @ApiResponse({
    type: DefaultResponse,
    status: 200,
  })
  async delete(@User() userId: string, @Param('number') accountNumber: string) {
    return await this.accountService.deleteMyAccount(userId, accountNumber);
  }
}
