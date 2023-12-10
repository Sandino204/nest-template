import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from '../../account/entities/account.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ColumnNumericTransformer } from '../../../transformers/numeric.transformer';

export enum TRANSACTION_TYPE {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}

@Entity({
  name: 'transaction',
})
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: TRANSACTION_TYPE,
  })
  type: TRANSACTION_TYPE;

  @ApiProperty()
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Account, (account) => account.transactions)
  account: Account;
}
