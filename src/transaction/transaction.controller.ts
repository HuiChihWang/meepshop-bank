import { Body, Controller, Post } from '@nestjs/common';
import {
  DepositRequest,
  TransactionResponse,
  TransferRequest,
  WithDrawRequest,
} from './transaction.dto';

@Controller('transaction')
export class TransactionController {
  @Post('deposit')
  async deposit(
    @Body() depositRequest: DepositRequest,
  ): Promise<TransactionResponse> {
    return null;
  }

  @Post('withdraw')
  async withdraw(
    @Body() withdrawRequest: WithDrawRequest,
  ): Promise<TransactionResponse> {
    return null;
  }

  @Post('transfer')
  async transfer(
    @Body() transferRequest: TransferRequest,
  ): Promise<TransactionResponse> {
    return null;
  }
}
