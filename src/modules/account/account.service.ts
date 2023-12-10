import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Account, ACCOUNT_TYPE } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import * as CryptoJS from 'crypto-js';
import * as uuid from 'uuid';
import { UpdateAccountDto } from './dto/update-account.dto';
import { TRANSACTION_TYPE } from '../transaction/entities/transaction.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  createHashNumber() {
    const hash = CryptoJS.MD5(uuid.v4()).toString();

    return parseInt(hash, 16).toString().substring(2, 14);
  }
  async createAccount(userId: string, { accountType }: CreateAccountDto) {
    const accountNumber = this.createHashNumber();

    return this.accountRepository.save({
      type: accountType,
      account_holder: {
        id: userId,
      },
      account_number: accountNumber,
      balance: 0,
    });
  }

  async getMyAccounts(userId: string) {
    return this.accountRepository.find({
      where: {
        account_holder: {
          id: userId,
        },
        deletedAt: null,
      },
    });
  }

  async getMyAccount(userId: string, accountNumber: string) {
    const exists = await this.accountRepository.findOne({
      where: {
        account_holder: {
          id: userId,
        },
        account_number: accountNumber,
        deletedAt: null,
      },
    });

    if (!exists) {
      throw new NotFoundException('account not found');
    }

    return exists;
  }

  async updateAccount(
    userId: string,
    accountNumber: string,
    { accountType }: UpdateAccountDto,
  ) {
    const exists = await this.getMyAccount(userId, accountNumber);

    return this.accountRepository.save({
      ...exists,
      type: accountType,
    });
  }

  async updateBalance(
    queryRunner: QueryRunner,
    accountId: string,
    amount: number,
  ) {
    const account = await queryRunner.manager.findOne(Account, {
      where: {
        id: accountId,
      },
    });

    const newValue = account.balance + amount;

    if (newValue < 0) {
      throw new ConflictException('insufficient money on account');
    }

    await queryRunner.manager.save(Account, {
      ...account,
      balance: newValue,
    });
  }

  async deleteMyAccount(userId: string, accountNumber: string) {
    const exists = await this.getMyAccount(userId, accountNumber);

    await this.accountRepository.softDelete(exists.id);

    return {
      success: true,
    };
  }
}
