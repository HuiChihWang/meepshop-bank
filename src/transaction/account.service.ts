import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async getAccount(accountId: string) {
    return this.accountRepo.findOneBy({
      id: accountId,
    });
  }

  async createAccount(user: string) {
    const newAccount = this.accountRepo.create({
      name: user,
      balance: 0,
    });

    return this.accountRepo.save(newAccount);
  }
}
