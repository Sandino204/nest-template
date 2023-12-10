import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Account } from '../../account/entities/account.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 11 })
  document: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @OneToMany(() => Account, (account) => account.account_holder)
  accounts: Account[];
}
