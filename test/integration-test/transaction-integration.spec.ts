import { Test } from '@nestjs/testing';
import { TransactionModule } from '../../src/transaction/transaction.module';
import { AccountController } from '../../src/transaction/account.controller';
import { TransactionController } from '../../src/transaction/transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('TransactionModule', () => {
  let accountController: AccountController;
  let transactionController: TransactionController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          synchronize: true,
          dropSchema: true,
          autoLoadEntities: true,
        }),

        TransactionModule,
      ],
    }).compile();

    accountController = module.get(AccountController);
    transactionController = module.get(TransactionController);
  });

  it('should be defined', () => {
    expect(accountController).toBeDefined();
    expect(transactionController).toBeDefined();
  });

  describe('create account and deposit money', () => {
    it('should create account and deposit money', async () => {
      const account = await accountController.createAccount({
        name: 'user',
      });

      await transactionController.deposit({
        accountId: account.accountId,
        amount: 100,
      });
      const updatedAccount = await accountController.getAccount(
        account.accountId,
      );
      expect(updatedAccount.balance).toBe(100);
    });
  });

  describe('create account and withdraw money', () => {
    it('should create account and deposit 100 and withdraw 50', async () => {
      const account = await accountController.createAccount({
        name: 'user',
      });

      await transactionController.deposit({
        accountId: account.accountId,
        amount: 100,
      });

      await transactionController.withdraw({
        accountId: account.accountId,
        amount: 50,
      });

      const updatedAccount = await accountController.getAccount(
        account.accountId,
      );
      expect(updatedAccount.balance).toBe(50);
    });
  });

  describe('create accounts and transfer money', () => {
    it('should create accounts and transfer money', async () => {
      const fromAccount = await accountController.createAccount({
        name: 'user1',
      });
      const toAccount = await accountController.createAccount({
        name: 'user2',
      });

      await transactionController.deposit({
        accountId: fromAccount.accountId,
        amount: 100,
      });

      await transactionController.transfer({
        fromAccount: fromAccount.accountId,
        toAccount: toAccount.accountId,
        amount: 30,
      });

      const updatedFromAccount = await accountController.getAccount(
        fromAccount.accountId,
      );

      const updatedToAccount = await accountController.getAccount(
        toAccount.accountId,
      );

      expect(updatedFromAccount.balance).toBe(70);
      expect(updatedToAccount.balance).toBe(30);
    });
  });
});
