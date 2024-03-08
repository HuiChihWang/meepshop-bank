import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from '../../../src/transaction/transaction.service';
import { Repository } from 'typeorm';
import { Account } from '../../../src/transaction/account.entity';
import { Transaction } from '../../../src/transaction/transaction.entity';
import { SqlTransactionUtil } from '../../../src/transaction/sql-transaction.util';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TransactionService', () => {
  let service: TransactionService;
  let accountRepoMock: Partial<Repository<Account>>;
  let transactionRepoMock: Partial<Repository<Transaction>>;
  let transactionUtilMock: Partial<SqlTransactionUtil>;

  beforeEach(async () => {
    accountRepoMock = {
      findOneByOrFail: jest.fn(),
      create: jest.fn(),
    };
    transactionRepoMock = {
      create: jest.fn(),
    };

    transactionUtilMock = {
      runWithTransaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Account),
          useValue: accountRepoMock,
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

      jest.spyOn(accountRepoMock, 'findOneByOrFail').mockResolvedValue(account);
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

      jest.spyOn(accountRepoMock, 'findOneByOrFail').mockResolvedValue(account);
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

      jest.spyOn(accountRepoMock, 'findOneByOrFail').mockResolvedValue(account);

      await expect(
        service.withdraw(account.id, withdrawAmount),
      ).rejects.toThrowError();
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
        .spyOn(accountRepoMock, 'findOneByOrFail')
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

      jest
        .spyOn(accountRepoMock, 'findOneByOrFail')
        .mockResolvedValue(fromAccount);

      await expect(
        service.transfer(fromAccount.id, toAccount.id, 100),
      ).rejects.toThrowError();
    });
  });
});