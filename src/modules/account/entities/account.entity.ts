import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { ColumnNumericTransformer } from '../../../transformers/numeric.transformer';

export enum ACCOUNT_TYPE {
  POUPANCA = 'POUPANCA',
  CONTA_CORRENTE = 'CONTA_CORRENTE',
}

@Entity({
  name: 'account',
})
export class Account {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ unique: true })
  account_number: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: ACCOUNT_TYPE,
  })
  type: ACCOUNT_TYPE;

  @ApiProperty()
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  balance: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.accounts)
  account_holder: User;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];
}
