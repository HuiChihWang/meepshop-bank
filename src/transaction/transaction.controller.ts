import { Body, Controller, Post } from '@nestjs/common';
import {
  DepositRequest,
  TransactionResponse,
  TransferRequest,
  WithDrawRequest,
} from './transaction.dto';
import { TransactionService } from './transaction.service';
import { AccountService } from './account.service';
import { AccountResponse } from './account.dto';

//TODO: think about api spec
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly accountService: AccountService,
  ) {}

  @Post('deposit')
  async deposit(
    @Body() depositRequest: DepositRequest,
  ): Promise<TransactionResponse> {
    await this.transactionService.deposit(
      depositRequest.accountId,
      depositRequest.amount,
    );

    const toAccount = await this.accountService.getAccount(
      depositRequest.accountId,
    );
    return {
      toAccount: AccountResponse.createResponse(toAccount),
    };
  }

  @Post('withdraw')
  async withdraw(
    @Body() withdrawRequest: WithDrawRequest,
  ): Promise<TransactionResponse> {
    await this.transactionService.withdraw(
      withdrawRequest.accountId,
      withdrawRequest.amount,
    );

    const fromAccount = await this.accountService.getAccount(
      withdrawRequest.accountId,
    );
    return {
      fromAccount: AccountResponse.createResponse(fromAccount),
    };
  }

  @Post('transfer')
  async transfer(
    @Body() transferRequest: TransferRequest,
  ): Promise<TransactionResponse> {
    await this.transactionService.transfer(
      transferRequest.fromAccount,
      transferRequest.toAccount,
      transferRequest.amount,
    );

    const fromAccount = await this.accountService.getAccount(
      transferRequest.fromAccount,
    );

    const toAccount = await this.accountService.getAccount(
      transferRequest.toAccount,
    );
    return {
      toAccount: AccountResponse.createResponse(toAccount),
      fromAccount: AccountResponse.createResponse(fromAccount),
    };
  }
}
