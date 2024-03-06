import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { Account } from "./account.entity";

@Injectable()
export class AccountService {
  constructor(private readonly accountRepo: Repository<Account>) {}

  async getAccount(accountId: string) {
    return this.accountRepo.findOneBy({
      id: accountId
    })
  }

  async createAccount(user: string) {
    const newAccount = this.accountRepo.create({
      name: user,
      balance: 0
    });

    return this.accountRepo.save(newAccount);
  }
}
