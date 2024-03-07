import { Account } from './account.entity';

export class CreateAccountRequest {
  readonly name: string;
}

export class AccountResponse {
  readonly accountId: string;
  readonly name: string;
  readonly balance: number;

  static createResponse = (account: Account): AccountResponse => ({
    accountId: account.id,
    name: account.name,
    balance: account.balance,
  });
}
