import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AccountResponse, CreateAccountRequest } from './account.dto';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async createAccount(
    @Body() request: CreateAccountRequest,
  ): Promise<AccountResponse> {
    const newAccount = await this.accountService.createAccount(request.name);

    return {
      accountId: newAccount.id,
      balance: newAccount.balance,
      name: newAccount.name,
    };
  }

  @Get(':/accountId')
  async getAccount(
    @Param('accountId') accountId: string,
  ): Promise<AccountResponse> {
    const account = await this.accountService.getAccount(accountId);
    return {
      accountId: account.id,
      balance: account.balance,
      name: account.name,
    };
  }
}
