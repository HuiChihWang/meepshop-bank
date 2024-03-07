import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './transaction.entity';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';

// TODO: support atomic transaction
@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
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

    try {
      await this.accountRepo.save(account);
      await this.transactionRepo.save(transaction);
    } catch (error) {
      // rollback transaction
      // throw error
    } finally {
      // release transaction
    }
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

    try {
      await this.accountRepo.save(account);
      await this.transactionRepo.save(transaction);
    } catch (error) {
      // rollback transaction
      // throw error
    } finally {
      // release transaction
    }
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

    try {
      await this.accountRepo.save(fromAccount);
      await this.accountRepo.save(toAccount);
      await this.transactionRepo.save(transaction);
    } catch (error) {
      // rollback transaction
      // throw error
    } finally {
      // release transaction
    }
  }
}
