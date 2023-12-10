import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../account/entities/account.entity';
import { AuthModule } from '../auth/auth.module';
import { Transaction } from './entities/transaction.entity';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), AuthModule, AccountModule],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
