import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  DataSource,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Transaction, TRANSACTION_TYPE } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AccountService } from '../account/account.service';
import { GetTransactionDto } from './dto/get-transactions.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly accountService: AccountService,
    private dataSource: DataSource,
  ) {}

  private async monetaryTransaction(
    accountId: string,
    amount: number,
    type: TRANSACTION_TYPE,
    description?: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.accountService.updateBalance(
        queryRunner,
        accountId,
        type === TRANSACTION_TYPE.DEPOSIT ? amount : amount * -1,
      );

      await queryRunner.manager.save(Transaction, {
        amount,
        description,
        type,
        account: {
          id: accountId,
        },
      });

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async createTransaction(
    userId: string,
    accountNumber: string,
    { amount, description, type }: CreateTransactionDto,
  ) {
    const account = await this.accountService.getMyAccount(
      userId,
      accountNumber,
    );

    await this.monetaryTransaction(account.id, amount, type, description);

    return {
      success: true,
    };
  }

  async getTransactions(
    userId: string,
    accountNumber: string,
    {
      type,
      description,
      startDate,
      endDate,
      minValue,
      maxValue,
    }: GetTransactionDto,
  ) {
    const account = await this.accountService.getMyAccount(
      userId,
      accountNumber,
    );

    const filterByDate =
      startDate && endDate ? Between(startDate, endDate) : undefined;

    const filterByValue =
      minValue && maxValue
        ? Between(minValue, maxValue)
        : minValue
        ? MoreThanOrEqual(minValue)
        : maxValue
        ? LessThanOrEqual(maxValue)
        : undefined;

    return this.transactionRepository.find({
      where: {
        account: {
          id: account.id,
        },
        type,
        description: description ? Like(`%${description}%`) : undefined,
        createdAt: filterByDate,
        amount: filterByValue,
      },
    });
  }
}
