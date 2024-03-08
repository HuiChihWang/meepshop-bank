import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AccountAlreadyExistsError,
  AccountNotFoundError,
} from './transaction.error';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async getAccount(accountId: string) {
    try {
      return await this.accountRepo.findOneByOrFail({
        id: accountId,
      });
    } catch (error) {
      throw new AccountNotFoundError(accountId);
    }
  }

  async createAccount(user: string) {
    const isUsernameExist = await this.accountRepo.exists({
      where: { name: user },
    });

    if (isUsernameExist) {
      throw new AccountAlreadyExistsError(user);
    }

    const newAccount = this.accountRepo.create({
      name: user,
    });

    return this.accountRepo.save(newAccount);
  }
}
