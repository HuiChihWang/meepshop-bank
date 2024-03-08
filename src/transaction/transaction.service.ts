import { Injectable } from '@nestjs/common';
import { Transaction, TransactionType } from './transaction.entity';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SqlTransactionUtil } from './sql-transaction.util';
import { Repository } from 'typeorm';
import {
  AccountNotFoundError,
  InsufficientBalanceError,
  InvalidAmountError,
} from './transaction.error';

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
    if (amount < 0) {
      throw new InvalidAmountError();
    }

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
    if (amount < 0) {
      throw new InvalidAmountError();
    }

    let account: Account;
    try {
      account = await this.accountRepo.findOneByOrFail({
        id: accountId,
      });
    } catch (error) {
      throw new AccountNotFoundError(accountId);
    }

    if (account.balance < amount) {
      throw new InsufficientBalanceError(accountId);
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
    if (amount < 0) {
      throw new InvalidAmountError();
    }

    let fromAccount: Account;
    try {
      fromAccount = await this.accountRepo.findOneByOrFail({
        id: fromAccountId,
      });
    } catch (error) {
      throw new AccountNotFoundError(fromAccountId);
    }

    let toAccount: Account;
    try {
      toAccount = await this.accountRepo.findOneByOrFail({
        id: toAccountId,
      });
    } catch (error) {
      throw new AccountNotFoundError(toAccountId);
    }

    if (fromAccount.balance < amount) {
      throw new InsufficientBalanceError(fromAccountId);
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
