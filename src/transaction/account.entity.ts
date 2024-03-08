import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  balance: number;

  @CreateDateColumn({
    type: process?.env?.NODE_ENV === 'test' ? 'datetime' : 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: process?.env?.NODE_ENV === 'test' ? 'datetime' : 'timestamp',
  })
  updatedAt: Date;
}
