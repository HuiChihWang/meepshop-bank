import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../../../src/transaction/transaction.service';
import { Repository } from 'typeorm';
import { Account } from '../../../src/transaction/account.entity';
import { Transaction } from '../../../src/transaction/transaction.entity';
import { SqlTransactionUtil } from '../../../src/transaction/sql-transaction.util';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  InsufficientBalanceError,
  InvalidAmountError,
} from '../../../src/transaction/transaction.error';
import { AccountService } from '../../../src/transaction/account.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let accountService: Partial<AccountService>;
  let transactionRepoMock: Partial<Repository<Transaction>>;
  let transactionUtilMock: Partial<SqlTransactionUtil>;

  beforeEach(async () => {
    transactionRepoMock = {
      create: jest.fn(),
    };

    transactionUtilMock = {
      runWithTransaction: jest.fn(),
    };

    accountService = {
      getAccount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: AccountService,
          useValue: accountService,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: transactionRepoMock,
        },
        {
          provide: SqlTransactionUtil,
          useValue: transactionUtilMock,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deposit', () => {
    it('should deposit amount to account', async () => {
      const depositAmount = 100;
      const account = {
        id: 'accountId',
        balance: 50,
      } as Account;

      const transaction = {
        toAccount: account,
        amount: depositAmount,
        type: 'DEPOSIT',
      } as Transaction;

      const finalTransaction = {
        toAccount: {
          ...account,
          amount: 150,
        },
        amount: depositAmount,
        type: 'DEPOSIT',
      };

      jest.spyOn(accountService, 'getAccount').mockResolvedValue(account);
      jest.spyOn(transactionRepoMock, 'create').mockReturnValue(transaction);

      const entityManagerMock = {
        save: jest.fn().mockResolvedValue(finalTransaction),
      } as any;

      jest
        .spyOn(transactionUtilMock, 'runWithTransaction')
        .mockImplementation(async (cb) => {
          await cb(entityManagerMock);
        });

      const savedTransaction = await service.deposit(account.id, depositAmount);
      expect(transactionUtilMock.runWithTransaction).toHaveBeenCalledTimes(1);
      expect(savedTransaction).toEqual({
        transaction: finalTransaction,
        toAccountBalance: 150,
      });
    });

    it('should throw error when amount is negative', async () => {
      const depositAmount = -100;
      const account = {
        id: 'accountId',
        balance: 50,
      } as Account;

      await expect(
        service.deposit(account.id, depositAmount),
      ).rejects.toThrowError(InvalidAmountError);
    });
  });
  describe('withdraw', () => {
    it('should withdraw amount from account', async () => {
      const withdrawAmount = 100;
      const account = {
        id: 'accountId',
        balance: 150,
      } as Account;

      const transaction = {
        fromAccount: account,
        amount: withdrawAmount,
        type: `WITHDRAW`,
      } as Transaction;

      const finalTransaction = {
        fromAccount: {
          ...account,
          amount: 50,
        },
        amount: withdrawAmount,
        type: 'WITHDRAW',
      };

      jest.spyOn(accountService, 'getAccount').mockResolvedValue(account);
      jest.spyOn(transactionRepoMock, 'create').mockReturnValue(transaction);

      const entityManagerMock = {
        save: jest.fn().mockResolvedValue(finalTransaction),
      } as any;

      jest
        .spyOn(transactionUtilMock, 'runWithTransaction')
        .mockImplementation(async (cb) => {
          await cb(entityManagerMock);
        });

      const savedTransaction = await service.withdraw(
        account.id,
        withdrawAmount,
      );
      expect(transactionUtilMock.runWithTransaction).toHaveBeenCalledTimes(1);
      expect(savedTransaction).toEqual({
        transaction: finalTransaction,
        fromAccountBalance: 50,
      });
    });
    it('should throw error when account balance is not sufficient', async () => {
      const withdrawAmount = 100;
      const account = {
        id: 'accountId',
        balance: 50,
      } as Account;

      jest.spyOn(accountService, 'getAccount').mockResolvedValue(account);

      await expect(
        service.withdraw(account.id, withdrawAmount),
      ).rejects.toThrowError(InsufficientBalanceError);
    });

    it('should throw error when amount is negative', async () => {
      const withdrawAmount = -100;
      const account = {
        id: 'accountId',
        balance: 50,
      } as Account;

      await expect(
        service.withdraw(account.id, withdrawAmount),
      ).rejects.toThrowError(InvalidAmountError);
    });
  });
  describe('transfer', () => {
    it('should transfer amount from one account to another', async () => {
      const fromAccount = {
        id: 'fromAccountId',
        balance: 150,
      } as Account;

      const toAccount = {
        id: 'toAccountId',
        balance: 50,
      } as Account;

      const transaction = {
        fromAccount,
        toAccount,
        amount: 100,
        type: `TRANSFER`,
      } as Transaction;

      const finalTransaction = {
        fromAccount: {
          ...fromAccount,
          amount: 50,
        },
        toAccount: {
          ...toAccount,
          amount: 150,
        },
        amount: 100,
        type: 'TRANSFER',
      };

      jest
        .spyOn(accountService, 'getAccount')
        .mockResolvedValueOnce(fromAccount)
        .mockResolvedValueOnce(toAccount);
      jest.spyOn(transactionRepoMock, 'create').mockReturnValue(transaction);

      const entityManagerMock = {
        save: jest.fn().mockResolvedValue(finalTransaction),
      } as any;

      jest
        .spyOn(transactionUtilMock, 'runWithTransaction')
        .mockImplementation(async (cb) => {
          await cb(entityManagerMock);
        });

      const savedTransaction = await service.transfer(
        fromAccount.id,
        toAccount.id,
        100,
      );
      expect(transactionUtilMock.runWithTransaction).toHaveBeenCalledTimes(1);
      expect(savedTransaction).toEqual({
        transaction: finalTransaction,
        fromAccountBalance: 50,
        toAccountBalance: 150,
      });
    });
    it('should throw error when from account balance is not sufficient', async () => {
      const fromAccount = {
        id: 'fromAccountId',
        balance: 50,
      } as Account;

      const toAccount = {
        id: 'toAccountId',
        balance: 100,
      } as Account;

      jest.spyOn(accountService, 'getAccount').mockResolvedValue(fromAccount);

      await expect(
        service.transfer(fromAccount.id, toAccount.id, 100),
      ).rejects.toThrowError(InsufficientBalanceError);
    });
  });

  it('should throw error when amount is negative', async () => {
    const fromAccount = {
      id: 'fromAccountId',
      balance: 50,
    } as Account;

    const toAccount = {
      id: 'toAccountId',
      balance: 100,
    } as Account;

    await expect(
      service.transfer(fromAccount.id, toAccount.id, -100),
    ).rejects.toThrowError(InvalidAmountError);
  });
});
