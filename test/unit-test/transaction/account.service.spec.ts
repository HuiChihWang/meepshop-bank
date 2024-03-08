import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../../../src/transaction/account.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from '../../../src/transaction/account.entity';
import { Repository } from 'typeorm';
import {
  AccountAlreadyExistsError,
  AccountNotFoundError,
} from '../../../src/transaction/transaction.error';

describe('AccountService', () => {
  let service: AccountService;
  let accountRepositoryMock: Partial<Repository<Account>>;

  beforeEach(async () => {
    accountRepositoryMock = {
      findOneBy: jest.fn(),
      findOneByOrFail: jest.fn(),
      exists: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } satisfies Partial<Repository<Account>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useValue: accountRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    it('should create account when name is not existed', async () => {
      const testAccount = {
        id: 'accountId',
        balance: 0,
        name: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Account;

      const createMock = jest.spyOn(accountRepositoryMock, 'create');
      const saveMock = jest.spyOn(accountRepositoryMock, 'save');
      saveMock.mockResolvedValue(testAccount);

      const account = await service.createAccount(testAccount.name);
      expect(account).toBeDefined();
      expect(account).toEqual(testAccount);
      expect(createMock).toHaveBeenCalledWith({ name: 'user' });
      expect(saveMock).toHaveBeenCalledTimes(1);
    });

    it('should throw error when name is existed', async () => {
      jest.spyOn(accountRepositoryMock, 'exists').mockResolvedValue(true);
      await expect(service.createAccount('user')).rejects.toThrowError(
        AccountAlreadyExistsError,
      );
    });

    describe('getAccount', () => {
      it('should return account when account existed', async () => {
        const testAccount: Account = {
          id: 'accountId',
          balance: 100,
          name: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        jest
          .spyOn(accountRepositoryMock, 'findOneByOrFail')
          .mockResolvedValue(testAccount);
        const account = await service.getAccount('accountId');
        expect(account).toEqual(testAccount);
      });

      it('should throw error when account not existed', async () => {
        const testId = 'accountId';
        jest
          .spyOn(accountRepositoryMock, 'findOneByOrFail')
          .mockRejectedValue(new Error(`Account ${testId} not found`));
        await expect(service.getAccount(testId)).rejects.toThrowError(
          AccountNotFoundError,
        );
      });
    });
  });
});
