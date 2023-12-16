import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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
}
