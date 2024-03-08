export class TransactionResponse {
  transactionId: number;
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
