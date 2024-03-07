import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { Transaction } from './transaction.entity';
import { SqlTransactionUtil } from './sql-transaction.util';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Transaction])],
  providers: [TransactionService, AccountService, SqlTransactionUtil],
  controllers: [TransactionController, AccountController],
})
export class TransactionModule {}
