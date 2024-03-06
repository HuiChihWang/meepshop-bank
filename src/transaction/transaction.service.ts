import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './transaction.entity';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepo: Repository<Transaction>) {}
  async deposit(accountId: string, amount: number) {
    // add amount to account;

    const transaction = this.transactionRepo.create({
      toAccount: accountId,
      amount: amount,
      type: TransactionType.DEPOSIT,
    });

    return this.transactionRepo.save(transaction);
  }

  async withdraw(accountId: string, amount: number) {
    // check whether amount can be withdrawn
    // remove amount to account
    const transaction = this.transactionRepo.create({
      type: TransactionType.WITHDRAW,
      amount: amount,
      fromAccount: accountId,
    });
    return this.transactionRepo.save(transaction);
  }

  async transfer(fromAccount: string, toAccount: string, amount: number) {
    // change money from accountA to accountB

    const transaction = this.transactionRepo.create({
      type: TransactionType.TRANSFER,
      amount: amount,
      fromAccount: fromAccount,
      toAccount: toAccount,
    });
    return this.transactionRepo.save(transaction);
  }
}
