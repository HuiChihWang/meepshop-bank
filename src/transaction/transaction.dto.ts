import { AccountResponse } from './account.dto';

export class TransactionResponse {
  fromAccount?: AccountResponse;
  toAccount?: AccountResponse;
}

export class DepositRequest {
  amount: number;
  accountId: string;
}

export class WithDrawRequest {
  amount: number;
  accountId: string;
}

export class TransferRequest {
  fromAccount: string;
  toAccount: string;
  amount: number;
}

export class TransferResponse {
  transactionId: string;
}
