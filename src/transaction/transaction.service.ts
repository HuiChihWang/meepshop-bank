import { Injectable } from '@nestjs/common';
import { Transaction, TransactionType } from './transaction.entity';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SqlTransactionUtil } from './sql-transaction.util';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly transactionHelper: SqlTransactionUtil,
  ) {}

  async deposit(accountId: string, amount: number) {
    const account = await this.accountRepo.findOneByOrFail({
      id: accountId,
    });

    const transaction = this.transactionRepo.create({
      toAccount: account,
      amount: amount,
      type: TransactionType.DEPOSIT,
    });

    account.balance += amount;

    let savedTransaction: Transaction;
    await this.transactionHelper.runWithTransaction(async (manager) => {
      await manager.save<Account>(account);
      savedTransaction = await manager.save<Transaction>(transaction);
    });

    return {
      transaction: savedTransaction,
      toAccountBalance: account.balance,
    };
  }

  async withdraw(accountId: string, amount: number) {
    const account = await this.accountRepo.findOneByOrFail({
      id: accountId,
    });

    if (account.balance < amount) {
      throw new Error(`account ${accountId} doesn't have sufficient amount`);
    }

    const transaction = this.transactionRepo.create({
      fromAccount: account,
      amount: amount,
      type: TransactionType.WITHDRAW,
    });

    account.balance -= amount;

    let savedTransaction: Transaction;
    await this.transactionHelper.runWithTransaction(async (manager) => {
      await manager.save<Account>(account);
      savedTransaction = await manager.save<Transaction>(transaction);
    });

    return {
      transaction: savedTransaction,
      fromAccountBalance: account.balance,
    };
  }

  async transfer(fromAccountId: string, toAccountId: string, amount: number) {
    const fromAccount = await this.accountRepo.findOneByOrFail({
      id: fromAccountId,
    });
    const toAccount = await this.accountRepo.findOneByOrFail({
      id: toAccountId,
    });

    if (fromAccount.balance < amount) {
      throw new Error(
        `account ${fromAccountId} doesn't have sufficient amount`,
      );
    }

    const transaction = this.transactionRepo.create({
      fromAccount: fromAccount,
      toAccount: toAccount,
      amount: amount,
      type: TransactionType.TRANSFER,
    });

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    let savedTransaction: Transaction;
    await this.transactionHelper.runWithTransaction(async (manager) => {
      await manager.save<Account>(fromAccount);
      await manager.save<Account>(toAccount);
      savedTransaction = await manager.save<Transaction>(transaction);
    });

    return {
      transaction: savedTransaction,
      fromAccountBalance: fromAccount.balance,
      toAccountBalance: toAccount.balance,
    };
  }
}
