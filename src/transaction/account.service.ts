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
    return this.accountRepo.findOneByOrFail({
      id: accountId,
    });
  }

  async createAccount(user: string) {
    const isUsernameExist = await this.accountRepo.exists({
      where: { name: user },
    });

    if (isUsernameExist) {
      throw new Error(`Username ${user} already exists`);
    }

    const newAccount = this.accountRepo.create({
      name: user,
    });

    return this.accountRepo.save(newAccount);
  }
}
