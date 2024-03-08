import { Body, Controller, Post } from '@nestjs/common';
import {
  DepositRequest,
  TransactionResponse,
  TransferRequest,
  WithDrawRequest,
} from './transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('deposit')
  async deposit(
    @Body() depositRequest: DepositRequest,
  ): Promise<TransactionResponse> {
    const { transaction } = await this.transactionService.deposit(
      depositRequest.accountId,
      depositRequest.amount,
    );

    return {
      transactionId: transaction.id,
    };
  }

  @Post('withdraw')
  async withdraw(
    @Body() withdrawRequest: WithDrawRequest,
  ): Promise<TransactionResponse> {
    const { transaction } = await this.transactionService.withdraw(
      withdrawRequest.accountId,
      withdrawRequest.amount,
    );

    return {
      transactionId: transaction.id,
    };
  }

  @Post('transfer')
  async transfer(
    @Body() transferRequest: TransferRequest,
  ): Promise<TransactionResponse> {
    const { transaction } = await this.transactionService.transfer(
      transferRequest.fromAccount,
      transferRequest.toAccount,
      transferRequest.amount,
    );

    return {
      transactionId: transaction.id,
    };
  }
}
