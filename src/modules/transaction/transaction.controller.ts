import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from '../../decorators/user.decorator';
import { GetTransactionDto } from './dto/get-transactions.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DefaultResponse } from '../account/response/default.response';
import { Transaction } from './entities/transaction.entity';

@Controller('transaction')
@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/:accountNumber')
  @ApiResponse({
    type: Transaction,
    status: 200,
    isArray: true,
  })
  async getTransactions(
    @User() userId: string,
    @Param('accountNumber') accountNumber: string,
    @Query() query: GetTransactionDto,
  ) {
    return await this.transactionService.getTransactions(
      userId,
      accountNumber,
      query,
    );
  }

  @Post('/:accountNumber')
  @ApiResponse({
    type: DefaultResponse,
    status: 200,
  })
  async createTransaction(
    @User() userId: string,
    @Param('accountNumber') accountNumber: string,
    @Body() payload: CreateTransactionDto,
  ) {
    return await this.transactionService.createTransaction(
      userId,
      accountNumber,
      payload,
    );
  }
}
