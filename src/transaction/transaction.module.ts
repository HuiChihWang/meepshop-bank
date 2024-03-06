import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { Transaction } from './transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Transaction])],
  providers: [TransactionService, AccountService],
  controllers: [TransactionController, AccountController],
})
export class TransactionModule {}
